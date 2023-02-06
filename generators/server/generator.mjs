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
  POST_INSTALL_PRIORITY,
  END_PRIORITY,
} from 'generator-jhipster/esm/priorities';
import { addingServerFiles, removeNtsSaasSkipFiles } from './files.mjs';
import { addNtsSaasFrameworkToMaven, configureNtsSaasFrameworkToServer } from '../nts-saas-framework-utils.mjs';
const { SERVER_MAIN_SRC_DIR, SERVER_MAIN_RES_DIR, DOCKER_DIR, INTERPOLATE_REGEX } = constants;

export default class extends ServerGenerator {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, ...features });

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints nts-saas')}`);
    }
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
      configureDocker() {
        this.replaceContent(
          `${DOCKER_DIR}app.yml`,
          `command: mysqld (.+)(--explicit_defaults_for_timestamp)`,
          `command: mysqld $1$2 --default-authentication-plugin=mysql_native_password --innodb-ft-min-token-size=2`,
          true
        );
        if (this.searchEngineElasticsearch) {
          this.replaceContent(`${DOCKER_DIR}elasticsearch.yml`, `ES_JAVA_OPTS=-Xms\\w+ -Xmx\\w+`, `ES_JAVA_OPTS=-Xms1024m -Xmx1024m`, true);
        }
      },
      configureApplicationYml() {
        if (this.databaseTypeMysql) {
          this.needleApi.base.addBlockContentToFile(
            {
              path: `${SERVER_MAIN_RES_DIR}config/`,
              file: `application.yml`,
              needle: `hibernate:`,
              splicable: [`  hibernate.dialect: ${this.packageName}.config.CustomMySqlDialect`],
            },
            `Cannot configure hibernate.dialect`
          );
        }
      },
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      ...super._postWriting(),
      async postWritingTemplateTask() {},
    };
  }

  get [POST_INSTALL_PRIORITY]() {
    return {
      ...super._postInstall(),
      async postInstallTemplateTask() {
        removeNtsSaasSkipFiles?.apply(this);
      },
    };
  }

  get [END_PRIORITY]() {
    return {
      ...super._end(),
      async endTemplateTask() {},
    };
  }
}
