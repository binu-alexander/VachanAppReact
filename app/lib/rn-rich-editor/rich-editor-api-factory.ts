import {RichEditorCommunicator} from './rich-editor-communicator';
import {RichEditorApi} from './rich-editor.props';
import {RichEditorMessages} from './rich-editor-messages';

export class RichEditorApiFactory {
  constructor(private communicator: RichEditorCommunicator) {}

  public create(): RichEditorApi {
    return {
      getHtml: async () => {
        return await this.communicator.sendoutWithCallback(
          {
            name: RichEditorMessages.outgoing.getHtml,
          },
          RichEditorMessages.incoming.returnHtml,
        );
      },
      setHtml: (html: string) => {
        this.communicator.sendout({
          name: RichEditorMessages.outgoing.setHtml,
          data: html,
        });
      },
      bold: () => {
        this.communicator.sendout({
          name: RichEditorMessages.outgoing.bold,
        });
      },
      italic: () => {
        this.communicator.sendout({
          name: RichEditorMessages.outgoing.italic,
        });
      },
      underline: () => {
        this.communicator.sendout({
          name: RichEditorMessages.outgoing.underline,
        });
      },
      orderedList: () => {
        this.communicator.sendout({
          name: RichEditorMessages.outgoing.orderedList,
        });
      },
      unOrderedList: () => {
        this.communicator.sendout({
          name: RichEditorMessages.outgoing.unOrderedList,
        });
      },
      strikethrough: () => {
        this.communicator.sendout({
          name: RichEditorMessages.outgoing.strikethrough,
        });
      },
      indent: () => {
        this.communicator.sendout({
          name: RichEditorMessages.outgoing.indent,
        });
      },
      outdent: () => {
        this.communicator.sendout({
          name: RichEditorMessages.outgoing.outdent,
        });
      },
      
    };
  }
}
