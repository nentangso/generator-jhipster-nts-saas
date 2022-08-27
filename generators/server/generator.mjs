import chalk from 'chalk';
import { constants } from 'generator-jhipster';
import ServerGenerator from 'generator-jhipster/esm/generators/server';
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
import { addingServerFiles, removeNtsSaasSkipFiles } from "./files.mjs";
import { addNtsSaasFrameworkToMaven, configureNtsSaasFrameworkToServer } from '../nts-saas-framework-utils.mjs';
const {
  SERVER_MAIN_SRC_DIR,
  SERVER_MAIN_RES_DIR,
  INTERPOLATE_REGEX,
} = constants;

export default class extends ServerGenerator {
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

  get [PROMPTING_PRIORITY]() {
    return {
      ...super._prompting(),
      async promptingTemplateTask() {},
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

  get [DEFAULT_PRIORITY]() {
    return {
      ...super._default(),
      async defaultTemplateTask() {},
    };
  }

  get [WRITING_PRIORITY]() {
    return {
      ...super._writing(),
      async writingTemplateTask() {
        await this.writeFiles({
          sections: addingServerFiles,
          context: this,
        });
      },
      addNtsSaasFramework() {
        if (this.skipServer) return;
        if (this.buildToolMaven) {
          addNtsSaasFrameworkToMaven?.apply(this);
        }
        configureNtsSaasFrameworkToServer?.apply(this);
      },
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      ...super._postWriting(),
      async postWritingTemplateTask() {},
    };
  }

  get [END_PRIORITY]() {
    return {
      ...super._end(),
      async endTemplateTask() {
        removeNtsSaasSkipFiles?.apply(this);
      },
    };
  }
}
