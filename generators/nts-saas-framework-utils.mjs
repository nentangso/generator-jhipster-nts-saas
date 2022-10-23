import { constants } from 'generator-jhipster';
import { NTS_SAAS_DEPENDENCIES_VERSION } from './nts-constants.mjs';
const { SERVER_MAIN_SRC_DIR, SERVER_MAIN_RES_DIR, SERVER_TEST_SRC_DIR } = constants;

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
  this.replaceContent(`${SERVER_MAIN_SRC_DIR}${this.javaDir}${this.mainClass}.java`, `CRLFLogConverter`, `NtsCRLFLogConverter`, true);
  this.replaceContent(
    `${SERVER_MAIN_SRC_DIR}${this.javaDir}${this.mainClass}.java`,
    `import ${this.packageName}.config.NtsCRLFLogConverter;`,
    `import org.nentangso.core.config.NtsCRLFLogConverter;`,
    false
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
  if (this.databaseTypeSql) {
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
    `${SERVER_TEST_SRC_DIR}${this.javaDir}test/util/OAuth2TestUtil.java`,
    `${this.packageName}.security.SecurityUtils`,
    `org.nentangso.core.security.SecurityUtils`,
    true
  );
  this.needleApi.base.addBlockContentToFile(
    {
      path: `${SERVER_TEST_SRC_DIR}${this.javaDir}security/`,
      file: `SecurityUtilsUnitTest.java`,
      needle: `import org.junit.jupiter.api.Test;`,
      splicable: [`import org.nentangso.core.security.SecurityUtils;`],
    },
    `Cannot import SecurityUtils`
  );
  this.needleApi.base.addBlockContentToFile(
    {
      path: `${SERVER_TEST_SRC_DIR}${this.javaDir}security/oauth2/`,
      file: `AudienceValidatorTest.java`,
      needle: `import org.junit.jupiter.api.Test;`,
      splicable: [`import org.nentangso.core.security.oauth2.AudienceValidator;`],
    },
    `Cannot import AudienceValidator`
  );
  if (!this.cacheProviderNo) {
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
  }
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
    // TEST
    // UserMapperTest
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}service/mapper/UserMapperTest.java`,
      `${this.packageName}.domain.UserEntity`,
      `org.nentangso.core.domain.UserEntity`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}service/mapper/UserMapperTest.java`,
      `${this.packageName}.service.dto.UserDTO`,
      `org.nentangso.core.service.dto.UserDTO`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}service/mapper/UserMapperTest.java`,
      `${this.packageName}.service.dto.AdminUserDTO`,
      `org.nentangso.core.service.dto.AdminUserDTO`,
      true
    );
    this.needleApi.base.addBlockContentToFile(
      {
        path: `${SERVER_TEST_SRC_DIR}${this.javaDir}service/mapper/`,
        file: `UserMapperTest.java`,
        needle: `import org.junit.jupiter.api.Test;`,
        splicable: [`import org.nentangso.core.service.mapper.UserMapper;`],
      },
      `Cannot import UserMapper`
    );
    // UserServiceIT
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}service/UserServiceIT.java`,
      `${this.packageName}.repository.UserRepository`,
      `org.nentangso.core.repository.UserRepository`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}service/UserServiceIT.java`,
      `${this.packageName}.domain.UserEntity`,
      `org.nentangso.core.domain.UserEntity`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}service/UserServiceIT.java`,
      `${this.packageName}.service.dto.AdminUserDTO`,
      `org.nentangso.core.service.dto.AdminUserDTO`,
      true
    );
    this.needleApi.base.addBlockContentToFile(
      {
        path: `${SERVER_TEST_SRC_DIR}${this.javaDir}service/`,
        file: `UserServiceIT.java`,
        needle: `import org.junit.jupiter.api.Test;`,
        splicable: [`import org.nentangso.core.service.UserService;`],
      },
      `Cannot import UserService`
    );
    // UserResourceIT
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`,
      `${this.packageName}.repository.UserRepository`,
      `org.nentangso.core.repository.UserRepository`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`,
      `${this.packageName}.repository.AuthorityRepository`,
      `org.nentangso.core.repository.AuthorityRepository`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`,
      `${this.packageName}.domain.UserEntity`,
      `org.nentangso.core.domain.UserEntity`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`,
      `${this.packageName}.domain.Authority`,
      `org.nentangso.core.domain.Authority`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`,
      `${this.packageName}.service.dto.AdminUserDTO`,
      `org.nentangso.core.service.dto.AdminUserDTO`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`,
      `${this.packageName}.service.mapper.UserMapper`,
      `org.nentangso.core.service.mapper.UserMapper`,
      true
    );
    this.replaceContent(`${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`, `CreatedDate`, `CreatedAt`, true);
    this.replaceContent(`${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`, `LastModifiedBy`, `UpdatedBy`, true);
    this.replaceContent(`${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`, `LastModifiedDate`, `UpdatedAt`, true);
    // PublicUserResourceIT
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/PublicUserResourceIT.java`,
      `${this.packageName}.repository.UserRepository`,
      `org.nentangso.core.repository.UserRepository`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/PublicUserResourceIT.java`,
      `${this.packageName}.repository.AuthorityRepository`,
      `org.nentangso.core.repository.AuthorityRepository`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/PublicUserResourceIT.java`,
      `${this.packageName}.domain.UserEntity`,
      `org.nentangso.core.domain.UserEntity`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/PublicUserResourceIT.java`,
      `${this.packageName}.domain.Authority`,
      `org.nentangso.core.domain.Authority`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/PublicUserResourceIT.java`,
      `${this.packageName}.service.dto.UserDTO`,
      `org.nentangso.core.service.dto.UserDTO`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/PublicUserResourceIT.java`,
      `${this.packageName}.service.dto.AdminUserDTO`,
      `org.nentangso.core.service.dto.AdminUserDTO`,
      true
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/PublicUserResourceIT.java`,
      `${this.packageName}.service.mapper.UserMapper`,
      `org.nentangso.core.service.mapper.UserMapper`,
      true
    );
  }
  this.replaceContent(
    `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/errors/ExceptionTranslatorIT.java`,
    `ErrorConstants.ERR_CONCURRENCY_FAILURE`,
    `NtsErrorConstants.ERR_CONCURRENCY_FAILURE`,
    false
  );
  this.replaceContent(
    `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/errors/ExceptionTranslatorIT.java`,
    `ErrorConstants.ERR_VALIDATION`,
    `NtsErrorConstants.ERR_VALIDATION`,
    false
  );
  this.needleApi.base.addBlockContentToFile(
    {
      path: `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/errors/`,
      file: `ExceptionTranslatorIT.java`,
      needle: `import org.junit.jupiter.api.Test;`,
      splicable: [`import org.nentangso.core.web.rest.errors.NtsErrorConstants;`],
    },
    `Cannot import NtsErrorConstants`
  );
  this.replaceContent(
    `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/errors/ExceptionTranslatorIT.java`,
    `{@link ExceptionTranslator}`,
    `{@link org.nentangso.core.web.rest.errors.NtsExceptionTranslator}`,
    false
  );
  if (this.databaseTypeMysql) {
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}config/MysqlTestContainer.java`,
      `memoryInBytes = 100 * 1024 * 1024`,
      `memoryInBytes = 256 * 1024 * 1024`,
      false
    );
    this.replaceContent(
      `${SERVER_TEST_SRC_DIR}${this.javaDir}config/MysqlTestContainer.java`,
      `memorySwapInBytes = 200 * 1024 * 1024`,
      `memorySwapInBytes = 512 * 1024 * 1024`,
      false
    );
  }
  this.replaceContent(
    `${SERVER_MAIN_RES_DIR}logback-spring.xml`,
    `converterClass="${this.packageName}.config.CRLFLogConverter"`,
    `converterClass="org.nentangso.core.config.NtsCRLFLogConverter"`,
    false
  );
  if (this.databaseTypeSql) {
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
}

export function configureNtsSaasFrameworkToEntityServer() {
  this.replaceContent(
    `${SERVER_MAIN_SRC_DIR}${this.entityAbsoluteFolder}/web/rest/${this.entityClass}Resource.java`,
    `${this.packageName}.web.rest.errors.BadRequestAlertException`,
    `org.nentangso.core.web.rest.errors.BadRequestAlertException`,
    true
  );
}
