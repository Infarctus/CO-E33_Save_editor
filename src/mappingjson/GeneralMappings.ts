export interface IntTag {
  Int: number;
  tag: Tags;
}

interface Tags {
  data: TagsData;
}
interface TagsData {
  Other: string;
}
