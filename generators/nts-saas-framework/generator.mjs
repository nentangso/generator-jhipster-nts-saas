import chalk from 'chalk';
import BaseGenerator from 'generator-jhipster/esm/generators/base';
import { PRIORITY_PREFIX, WRITING_PRIORITY, POST_WRITING_PRIORITY } from 'generator-jhipster/esm/priorities';

export default class extends BaseGenerator {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, ...features });

    if (this.options.help) return;
  }

  get [WRITING_PRIORITY]() {
    return {
      // ...super._writing(),
      async writingTemplateTask() {
        await this.writeFiles({
          sections: {
            files: [{ templates: ['template-file-base'] }],
          },
          context: this,
        });
      },
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      // ...super._postWriting(),
      async postWritingTemplateTask() {},
    };
  }
}
