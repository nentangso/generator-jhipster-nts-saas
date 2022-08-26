import chalk from 'chalk';
import MavenGenerator from 'generator-jhipster/esm/generators/maven';
import {
  PRIORITY_PREFIX,
  INITIALIZING_PRIORITY,
  PROMPTING_PRIORITY,
  CONFIGURING_PRIORITY,
  COMPOSING_PRIORITY,
  LOADING_PRIORITY,
  PREPARING_PRIORITY,
  DEFAULT_PRIORITY,
  WRITING_PRIORITY,
  POST_WRITING_PRIORITY,
  END_PRIORITY,
} from 'generator-jhipster/esm/priorities';

export default class extends MavenGenerator {
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
      async initializingTemplateTask() {},
    };
  }

  get [PROMPTING_PRIORITY]() {
    return {
      async promptingTemplateTask() {},
    };
  }

  get [CONFIGURING_PRIORITY]() {
    return {
      async configuringTemplateTask() {},
    };
  }

  get [COMPOSING_PRIORITY]() {
    return {
      async composingTemplateTask() {},
    };
  }

  get [LOADING_PRIORITY]() {
    return {
      async loadingTemplateTask() {},
    };
  }

  get [PREPARING_PRIORITY]() {
    return {
      async preparingTemplateTask() {},
    };
  }

  get [DEFAULT_PRIORITY]() {
    return {
      async defaultTemplateTask() {},
    };
  }

  get [WRITING_PRIORITY]() {
    return {
      async writingTemplateTask() {
        await this.writeFiles({
          sections: {
            files: [{ templates: ['template-file-maven'] }],
          },
          context: this,
        });
      },
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      async postWritingTemplateTask() {},
    };
  }

  get [END_PRIORITY]() {
    return {
      async endTemplateTask() {},
    };
  }
}
