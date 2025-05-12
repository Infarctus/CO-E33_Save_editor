export interface IntTag {
  Int: number;
  tag: Tags;
}

export interface IntSingleton {
  Int: number;
}

export interface DoubleTag {
  Double: number;
  tag: Tags;
}




export interface BoolTag {
  Bool: boolean;
  tag: Tags;
}

export interface StringTag {
  Name: string;
  tag: Tags;
}

export interface StringsArrayTag {
  tag: any;
  Array: {
    Base: {
      Name: string[];
    };
  };
}

export function getValueFromTag(tag: IntTag | IntSingleton| DoubleTag | BoolTag | StringTag | StringsArrayTag):  string {
  if ('Double' in tag) {
    return (tag as DoubleTag).Double.toString();
  } else if ('Int' in tag) {
    return (tag as IntTag).Int.toString();
  } else if ('Bool' in tag) {
    return (tag as BoolTag).Bool.toString();
  } else if ('Name' in tag) {
    return (tag as StringTag).Name.toString();
  } else if ('Array' in tag) {
    return (tag as StringsArrayTag).Array.Base.Name.join(", ")
  } else return "Unknown tag "+tag;
}


export function setValueOfTag(tag: IntTag | DoubleTag | BoolTag | StringTag | StringsArrayTag, value: number | boolean | string | string[]): void {
  if ('Double' in tag) {
    (tag as DoubleTag).Double = typeof value === 'number' ? value : parseFloat(value.toString());
  } else if ('Int' in tag) {
    (tag as IntTag).Int = typeof value === 'number' ? value : parseInt(value.toString());
  } else if ('Bool' in tag) {
    (tag as BoolTag).Bool = typeof value === 'boolean' ? value : value.toString().toLowerCase() === 'true';
  } else if ('Name' in tag) {
    (tag as StringTag).Name = value.toString();
  } else if ('Array' in tag) {
    (tag as StringsArrayTag).Array.Base.Name = Array.isArray(value) ? value : [value.toString()];
  } else {
    throw new Error("Unknown tag type");
  }
}

interface Tags {
  data: TagsData;
}
interface TagsData {
  Other: string;
}
