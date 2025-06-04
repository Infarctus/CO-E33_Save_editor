use std::fs::File;
use std::io::{self, Read, Error, ErrorKind};
use std::path::Path;


/// Read a single little‐endian u8 from the stream.
fn read_u8<R: Read>(reader: &mut R) -> io::Result<u8> {
    let mut buf = [0u8; 1];
    reader.read_exact(&mut buf)?;
    Ok(u8::from_le_bytes(buf))
}

/// Read a single little‐endian u32 from the stream.
fn read_u32<R: Read>(reader: &mut R) -> io::Result<u32> {
    let mut buf = [0u8; 4];
    reader.read_exact(&mut buf)?;
    Ok(u32::from_le_bytes(buf))
}

/// Read a single little‐endian u64 from the stream.
fn read_u64<R: Read>(reader: &mut R) -> io::Result<u64> {
    let mut buf = [0u8; 8];
    reader.read_exact(&mut buf)?;
    Ok(u64::from_le_bytes(buf))
}

/// Read a UTF-16LE‐encoded string, preceded by a little‐endian u32 length.
/// If length is zero, returns an empty `String`.
fn read_utf16_string<R: Read>(reader: &mut R) -> io::Result<String> {
    let len = read_u32(reader)? as usize;
    if len == 0 {
        return Ok(String::new());
    }

    // Read `len * 2` bytes
    let mut raw = vec![0u8; len * 2];
    reader.read_exact(&mut raw)?;

    // Convert pairs of bytes into u16 (little-endian), then from_utf16
    let mut utf16_buf = Vec::with_capacity(len);
    for chunk in raw.chunks_exact(2) {
        let lo = chunk[0];
        let hi = chunk[1];
        utf16_buf.push(u16::from_le_bytes([lo, hi]));
    }

    String::from_utf16(&utf16_buf)
        .map_err(|e| Error::new(ErrorKind::InvalidData, format!("UTF-16 decode error: {}", e)))
}

/// Compute the “folder name” string from a 16-byte UUID buffer,
/// exactly as the Python code did with struct.unpack("<IHHHBBBBBB") + formatting.
///
/// Steps:
///  1) Interpret bytes[0..4]  as a u32 LE, format as 8‐digit uppercase hex.
///  2) bytes[4..6]          as a u16 LE, format as 4‐digit uppercase hex.
///  3) bytes[6..8]          as a u16 LE, format as 4‐digit uppercase hex.
///  4) bytes[8..10]         as a u16 LE, format as 4‐digit uppercase hex.
///  5) bytes[10..16]        as six u8’s, each formatted as 2‐digit uppercase hex.
///  6) Concatenate all parts in order.
/// This matches what `struct.unpack("<IHHHBBBBBB")` + the Python formatting did.
fn uuid_bytes_to_folder_name(raw: &[u8; 16]) -> String {
    // 1. First 4 bytes → u32 LE
    let time_low = u32::from_le_bytes([raw[0], raw[1], raw[2], raw[3]]);
    let part0 = format!("{:08X}", time_low);

    // 2. Next 2 bytes → u16 LE
    let time_mid = u16::from_le_bytes([raw[4], raw[5]]);
    let part1 = format!("{:04X}", time_mid);

    // 3. Next 2 bytes → u16 LE
    let time_hi_and_version = u16::from_le_bytes([raw[6], raw[7]]);
    let part2 = format!("{:04X}", time_hi_and_version);

    // // 4. Next 2 bytes → u16 LE
    // let clock_seq = u16::from_le_bytes([raw[8], raw[9]]);
    // let part3 = format!("{:04X}", clock_seq);

    // 5. Last 6 bytes → six u8’s
    let mut part4 = String::new();
    for i in 8..16 {
        part4.push_str(&format!("{:02X}", raw[i]));
    }

    // 6. Concatenate
    part0 + &part1 + &part2 +  &part4
}

/// Opens `containers.index`, parses each `Container`, and returns a Vec of 
/// `(container_name, folder_name)` for those names that start with `"EXPEDITION_"`.
///
/// On any I/O error or format mismatch, returns an Err.
fn get_expedition_folder_names<P: AsRef<Path>>(index_path: P) -> io::Result<Vec<(String, String)>> {
    let mut file = File::open(index_path)?;

    // 1) version (u32) should be 0x0E
    let version = read_u32(&mut file)?;
    if version != 0x0E {
        return Err(Error::new(
            ErrorKind::InvalidData,
            format!("Unsupported container index version: {:#X}", version),
        ));
    }

    // 2) file_count = number of Container records
    let file_count = read_u32(&mut file)? as usize;

    // 3) flag1 (u32) — we can ignore it
    let _flag1 = read_u32(&mut file)?;

    // 4) package_name (UTF-16LE string)
    let _package_name = read_utf16_string(&mut file)?;

    // 5) mtime (u64) — FILETIME, we skip
    let _mtime = read_u64(&mut file)?;

    // 6) flag2 (u32) — ignore
    let _flag2 = read_u32(&mut file)?;

    // 7) index_uuid (UTF-16LE string) — ignore
    let _index_uuid = read_utf16_string(&mut file)?;

    // 8) unknown (u64) — must be present, but ignored
    let _unknown = read_u64(&mut file)?;

    let mut output = Vec::new();

    // Now loop over each of the `file_count` Container entries
    for _ in 0..file_count {
        // A) Read container_name (UTF-16LE)
        let container_name = read_utf16_string(&mut file)?;
        // B) Read container_name_repeated (UTF-16LE) and ensure match
        let container_name_repeated = read_utf16_string(&mut file)?;
        if container_name != container_name_repeated {
            return Err(Error::new(
                ErrorKind::InvalidData,
                format!(
                    "Container name mismatch: '{}' != '{}'",
                    container_name, container_name_repeated
                ),
            ));
        }

        // C) cloud_id (UTF-16LE) — ignore further
        let _cloud_id = read_utf16_string(&mut file)?;

        // D) seq (u8) — ignore
        let _seq = read_u8(&mut file)?;

        // E) flag (u32) — ignore
        let _flag = read_u32(&mut file)?;

        // F) container_uuid: next 16 bytes
        let mut uuid_bytes = [0u8; 16];
        file.read_exact(&mut uuid_bytes)?;

        // G) mtime (u64) — ignore
        let _c_mtime = read_u64(&mut file)?;

        // H) unknown (u64) — must be zero
        let unknown2 = read_u64(&mut file)?;
        if unknown2 != 0 {
            return Err(Error::new(
                ErrorKind::InvalidData,
                format!("Unexpected data in Container: unknown field = {}", unknown2),
            ));
        }

        // I) size (u64) — ignore
        let _size = read_u64(&mut file)?;

        // If the container name begins with "EXPEDITION_", compute its folder name:
        if container_name.starts_with("EXPEDITION_") {
            let folder_name = uuid_bytes_to_folder_name(&uuid_bytes);
            output.push((container_name.clone(), folder_name));
        }
    }

    Ok(output)
}

#[tauri::command]
pub fn getxboxsavesfrompath(index_path: String) -> Result<Vec<(String, String)>, String> {
    get_expedition_folder_names(index_path)
        .map_err(|e| format!("Failed to read containers.index: {}", e))
}