export interface IntTag {
  Int: number;
  tag: Tags;
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

interface Tags {
  data: TagsData;
}
interface TagsData {
  Other: string;
}
