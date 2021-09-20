export interface RichEditorApi {
  getHtml(): Promise<string>;
  setHtml: (html: string) => void;
  bold: () => void;
  italic: () => void;
  underline: () => void;
  orderedList: () => void;
  unOrderedList: () => void;
  strikethrough: () => void;
  outdent: () => void;
  indent: () => void;
}
export interface RichEditorProps {
  initialHtml: string;
  initialPlaceholder?: string;
  onInitialized: (api: RichEditorApi) => void;
  style:Object;
}
