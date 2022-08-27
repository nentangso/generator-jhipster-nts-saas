import { constants } from 'generator-jhipster';
import { NTS_SAAS_DEPENDENCIES_VERSION } from './nts-constants.mjs';
const { SERVER_MAIN_SRC_DIR, SERVER_MAIN_RES_DIR } = constants;

export function addNtsSaasFrameworkToMaven() {
  this.needleApi.serverMaven.addProperty('nts-saas-dependencies.version', NTS_SAAS_DEPENDENCIES_VERSION);
  this.needleApi.serverMaven.addDependencyManagement(
    'org.nentangso',
    'nts-saas-dependencies',
    '${nts-saas-dependencies.version}',
    'pom',
    'import'
  );
  if (!this.reactive) {
    this.needleApi.serverMaven.addDependencyInDirectory('', 'org.nentangso', 'nts-saas-starter-web', undefined, undefined);
  } else {
    this.needleApi.serverMaven.addDependencyInDirectory('', 'org.nentangso', 'nts-saas-starter-webflux', undefined, undefined);
  }
}

export function configureNtsSaasFrameworkToServer() {
  this.needleApi.base.addBlockContentToFile(
    {
      path: `${SERVER_MAIN_RES_DIR}config/liquibase/`,
      file: `master.xml`,
      needle: `jhipster-needle-liquibase-add-changelog`,
      splicable: [`<include file="config/liquibase/changelog/00000000000001_initial_nts_helper.xml" relativeToChangelogFile="false"/>`],
    },
    `Cannot import @ComponentScan`
  );
  this.replaceContent(`${SERVER_MAIN_RES_DIR}config/liquibase/data/user.csv`, `last_modified_by`, `updated_by`, false);
  this.needleApi.base.addBlockContentToFile(
    {
      path: `${SERVER_MAIN_SRC_DIR}${this.javaDir}`,
      file: `${this.mainClass}.java`,
      needle: `@EnableConfigurationProperties`,
      splicable: [`@ComponentScan({"org.nentangso.core", "${this.packageName}"})`],
    },
    `Cannot configure @ComponentScan`
  );
  this.needleApi.base.addBlockContentToFile(
    {
      path: `${SERVER_MAIN_SRC_DIR}${this.javaDir}`,
      file: `${this.mainClass}.java`,
      needle: `import org.springframework.boot.context.properties.EnableConfigurationProperties;`,
      splicable: [`import org.springframework.context.annotation.ComponentScan;`],
    },
    `Cannot import @ComponentScan`
  );
  if (this.reactive) {
    this.needleApi.base.addBlockContentToFile(
      {
        path: `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/`,
        file: `DatabaseConfiguration.java`,
        needle: `import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;`,
        splicable: [`import org.springframework.boot.autoconfigure.domain.EntityScan;`],
      },
      `Cannot import @EntityScan`
    );
    this.needleApi.base.addBlockContentToFile(
      {
        path: `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/`,
        file: `DatabaseConfiguration.java`,
        needle: `@EnableR2dbcRepositories`,
        splicable: [`@EntityScan({"org.nentangso.core.domain", "${this.packageName}.domain"})`],
      },
      `Cannot configure @EntityScan`
    );
    this.replaceContent(
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/DatabaseConfiguration.java`,
      `@EnableR2dbcRepositories({`,
      `@EnableR2dbcRepositories({ "org.nentangso.core.repository",`,
      false
    );
  } else {
    this.replaceContent(
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/DatabaseConfiguration.java`,
      `@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")`,
      `@EnableJpaAuditing(auditorAwareRef = "ntsSpringSecurityAuditorAware")`,
      false
    );
  }
  this.replaceContent(
    `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/SecurityConfiguration.java`,
    `${this.packageName}.security.oauth2.AudienceValidator`,
    `org.nentangso.core.security.oauth2.AudienceValidator`,
    true
  );
  this.replaceContent(
    `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/SecurityConfiguration.java`,
    `${this.packageName}.security.oauth2.JwtGrantedAuthorityConverter`,
    `org.nentangso.core.security.oauth2.JwtGrantedAuthorityConverter`,
    true
  );
  this.replaceContent(
    `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/SecurityConfiguration.java`,
    `${this.packageName}.security.SecurityUtils`,
    `org.nentangso.core.security.SecurityUtils`,
    true
  );
  this.replaceContent(
    `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/CacheConfiguration.java`,
    `${this.packageName}.repository.UserRepository`,
    `org.nentangso.core.repository.UserRepository`,
    true
  );
  this.replaceContent(
    `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/CacheConfiguration.java`,
    `${this.packageName}.domain.UserEntity`,
    `org.nentangso.core.domain.UserEntity`,
    true
  );
  this.replaceContent(
    `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/CacheConfiguration.java`,
    `${this.packageName}.domain.Authority`,
    `org.nentangso.core.domain.Authority`,
    true
  );
  if (this.applicationTypeGateway) {
    this.replaceContent(
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}repository/rowmapper/UserRowMapper.java`,
      `${this.packageName}.domain.UserEntity`,
      `org.nentangso.core.domain.UserEntity`,
      true
    );
    this.replaceContent(
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}web/rest/AccountResource.java`,
      `${this.packageName}.security.SecurityUtils`,
      `org.nentangso.core.security.SecurityUtils`,
      true
    );
    this.replaceContent(
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}web/rest/AccountResource.java`,
      `${this.packageName}.service.UserService`,
      `org.nentangso.core.service.UserService`,
      true
    );
    this.replaceContent(
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}web/rest/AccountResource.java`,
      `${this.packageName}.service.dto.AdminUserDTO`,
      `org.nentangso.core.service.dto.AdminUserDTO`,
      true
    );
  }
  this.replaceContent(
    `${SERVER_MAIN_RES_DIR}config/liquibase/changelog/00000000000000_initial_schema.xml`,
    `"${this.jhiPrefix}_user"`,
    `"${this.jhiPrefix}_users"`,
    true
  );
  this.replaceContent(
    `${SERVER_MAIN_RES_DIR}config/liquibase/changelog/00000000000000_initial_schema.xml`,
    `"${this.jhiPrefix}_authority"`,
    `"${this.jhiPrefix}_authorities"`,
    true
  );
}

export function configureNtsSaasFrameworkToEntityServer() {
  this.replaceContent(
    `${SERVER_MAIN_SRC_DIR}${this.entityAbsoluteFolder}/web/rest/${this.entityClass}Resource.java`,
    `${this.packageName}.web.rest.errors.BadRequestAlertException`,
    `org.nentangso.core.web.rest.errors.BadRequestAlertException`,
    true
  );
}
