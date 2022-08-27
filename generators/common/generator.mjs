import chalk from 'chalk';
import CommonGenerator from 'generator-jhipster/esm/generators/common';
import {
  PRIORITY_PREFIX,
  INITIALIZING_PRIORITY,
  CONFIGURING_PRIORITY,
  COMPOSING_PRIORITY,
  LOADING_PRIORITY,
  PREPARING_PRIORITY,
  WRITING_PRIORITY,
  POST_WRITING_PRIORITY,
} from 'generator-jhipster/esm/priorities';

export default class extends CommonGenerator {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, ...features });

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints nts-saas')}`);
    }

    this.sbsBlueprint = true;
  }

  get [INITIALIZING_PRIORITY]() {
    return {
      ...super._initializing(),
      async initializingTemplateTask() {},
    };
  }

  get [CONFIGURING_PRIORITY]() {
    return {
      ...super._configuring(),
      async configuringTemplateTask() {},
    };
  }

  get [COMPOSING_PRIORITY]() {
    return {
      ...super._composing(),
      async composingTemplateTask() {},
    };
  }

  get [LOADING_PRIORITY]() {
    return {
      ...super._loading(),
      async loadingTemplateTask() {},
    };
  }

  get [PREPARING_PRIORITY]() {
    return {
      ...super._preparing(),
      async preparingTemplateTask() {},
    };
  }

  get [WRITING_PRIORITY]() {
    return {
      ...super._writing(),
      async writingTemplateTask() {
        // await this.writeFiles({
        //   sections: {
        //     files: [{ templates: ['template-file-common'] }],
        //   },
        //   context: this,
        // });
      },
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      ...super._postWriting(),
      async postWritingTemplateTask() {},
    };
  }
}
