// Base tag types
export interface Tags<T = string> {
  data: {
    Other: T
  }
}

export interface TagsArray<T = string> {
  data: {
    Array: {
      Other: T
    }
  }
}

export interface ByteArrayComponent<BytePath = string> {
  tag: {
    data: {
      Array: {
        Byte: BytePath
      }
    }
  }
  Array: {
    Base: {
      Byte: {
        Label: string[]
      }
    }
  }
}

// Basic property types
export interface IntComponent {
  Int: number
  tag: Tags<'IntProperty'>
}

export interface IntSingleton {
  Int: number
}

export interface DoubleComponent {
  Double: number
  tag: Tags<'DoubleProperty'>
}

export interface BoolComponent {
  Bool: boolean
  tag: Tags<'BoolProperty'>
}

export interface StringComponent {
  Name: string
  tag: Tags<'NameProperty'>
}

export interface StringsArrayComponent {
  tag: TagsArray<'NameProperty'>
  Array: {
    Base: {
      Name: string[]
    }
  }
}

export interface ByteComponent<ByteName = string> {
  tag: {
    data: {
      Byte: ByteName
    }
  }
  Byte: {
    Label: string
  }
}

export interface StrucTypeTag<StructPath = string, id = string> {
  data: StructProperty<StructPath, id>
}

export interface StructProperty<StructPath = string, id = string> {
  Struct: {
    struct_type: {
      Struct: StructPath
    }
    id: id
  }
}

export interface MapTagSimple<KeyType = string, ValueType = string> {
  data: {
    Map: {
      key_type: {
        Other: KeyType
      }
      value_type: {
        Other: ValueType
      }
    }
  }
}

export interface MapTagKeyStruct<KeyType = StructProperty, ValueType = string> {
  data: {
    Map: {
      key_type: KeyType
      value_type: {
        Other: ValueType
      }
    }
  }
}

export interface MapTagValueStruct<KeyType = string, ValueType = StructProperty> {
  data: {
    Map: {
      key_type: {
        Other: KeyType
      }
      value_type: ValueType
    }
  }
}
