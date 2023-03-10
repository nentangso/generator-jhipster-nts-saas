import { constants } from 'generator-jhipster';
import { NTS_SAAS_DEPENDENCIES_VERSION } from './nts-constants.mjs';
const { SERVER_MAIN_SRC_DIR, SERVER_MAIN_RES_DIR, SERVER_TEST_SRC_DIR } = constants;

const shouldSkipUserManagement = generator =>
  generator.skipUserManagement && (!generator.applicationTypeMonolith || !generator.authenticationTypeOauth2);

function relocatedFiles() {
  return [
    `config.NtsCRLFLogConverter`,
    `domain.Authority`,
    `domain.User${this.entitySuffix}`,
    `repository.AuthorityRepository`,
    `repository.UserRepository`,
    `security.SecurityUtils`,
    `security.oauth2.AudienceValidator`,
    `security.oauth2.JwtGrantedAuthorityConverter`,
    `service.UserService`,
    `service.dto.AdminUserDTO`,
    `service.dto.UserDTO`,
    `service.mapper.UserMapper`,
    `web.rest.errors.BadRequestAlertException`,
    `web.rest.vm.ManagedUserVM`,
  ];
}

function prefixedBeanNames() {
  return [
    `UserService`,
    `UserMapper`,
    `UserRepository`,
    `AuthorityRepository`,
    `UserEntity`,
    `Authority`,
    `AdminUserDTO`,
    `UserDTO`,
    `ManagedUserVM`,
  ];
}

function replaceNtsSaasCore(...files) {
  const searchByPackage = `${this.packageName}\.(${relocatedFiles.apply(this).join('|')})`;
  const searchByName = `(\\s|\\.|,|<|\\()(${prefixedBeanNames.apply(this).join('|')})`;
  files.forEach(file => {
    this.replaceContent(file, searchByPackage, `org.nentangso.core.\$1`, true);
    this.replaceContent(file, searchByName, `\$1Nts\$2`, true);
  });
}

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
      this.needleApi.base.addBlockContentToFile(
        {
          path: `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/`,
          file: `DatabaseConfiguration.java`,
          needle: `import org.springframework.data.jpa.repository.config.EnableJpaRepositories;`,
          splicable: [`import org.springframework.boot.autoconfigure.domain.EntityScan;`],
        },
        `Cannot import @EntityScan`
      );
      this.needleApi.base.addBlockContentToFile(
        {
          path: `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/`,
          file: `DatabaseConfiguration.java`,
          needle: `@EnableJpaRepositories`,
          splicable: [`@EntityScan({"org.nentangso.core.domain", "${this.packageName}.domain"})`],
        },
        `Cannot configure @EntityScan`
      );
      this.replaceContent(
        `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/DatabaseConfiguration.java`,
        `@EnableJpaRepositories({`,
        `@EnableJpaRepositories({ "org.nentangso.core.repository",`,
        false
      );
      this.replaceContent(
        `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/DatabaseConfiguration.java`,
        `@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")`,
        `@EnableJpaAuditing(auditorAwareRef = "ntsSpringSecurityAuditorAware")`,
        false
      );
    }
    if ((this.cacheProviderEhCache || this.cacheProviderCaffeine || this.cacheProviderInfinispan || this.cacheProviderRedis) && this.enableHibernateCache) {
      [
        'NtsTagsEntity',
        'NtsNoteEntity',
        'NtsMetafieldEntity',
        'NtsOutboxEventEntity',
        'NtsOptionEntity',
      ].forEach(entityClass => this.addEntityToCache(entityClass, [], 'org.nentangso.core', this.packageFolder, this.cacheProvider));
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
  if (this.authenticationTypeOauth2) {
    this.needleApi.base.addBlockContentToFile(
      {
        path: `${SERVER_TEST_SRC_DIR}${this.javaDir}security/oauth2/`,
        file: `AudienceValidatorTest.java`,
        needle: `import org.junit.jupiter.api.Test;`,
        splicable: [`import org.nentangso.core.security.oauth2.*;`],
      },
      `Cannot import core security`
    );
  }
  if (!this.reactive && this.authenticationTypeOauth2 && (this.applicationTypeMicroservice || this.applicationTypeGateway)) {
    this.needleApi.base.addBlockContentToFile(
      {
        path: `${SERVER_TEST_SRC_DIR}${this.javaDir}security/oauth2/`,
        file: `AuthorizationHeaderUtilTest.java`,
        needle: `import org.junit.jupiter.api.Test;`,
        splicable: [`import org.nentangso.core.security.oauth2.*;`],
      },
      `Cannot import core security`
    );
  }
  if (!this.reactive && this.authenticationTypeOauth2 && !this.applicationTypeMicroservice) {
    replaceNtsSaasCore.apply(this, [
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}security/oauth2/CustomClaimConverter.java`,
      `${SERVER_TEST_SRC_DIR}${this.javaDir}security/oauth2/CustomClaimConverterIT.java`,
    ]);
  }
  if (!this.skipUserManagement || (this.authenticationTypeOauth2 && !this.databaseTypeNo)) {
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
    this.needleApi.base.addBlockContentToFile(
      {
        path: `${SERVER_TEST_SRC_DIR}${this.javaDir}service/`,
        file: `UserServiceIT.java`,
        needle: `import org.junit.jupiter.api.Test;`,
        splicable: [`import org.nentangso.core.service.UserService;`],
      },
      `Cannot import UserService`
    );
    this.replaceContent(`${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`, `CreatedDate`, `CreatedAt`, true);
    this.replaceContent(`${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`, `LastModifiedBy`, `UpdatedBy`, true);
    this.replaceContent(`${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`, `LastModifiedDate`, `UpdatedAt`, true);
    replaceNtsSaasCore.apply(this, [
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}repository/rowmapper/UserRowMapper.java`,
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}web/rest/AccountResource.java`,
      `${SERVER_TEST_SRC_DIR}${this.javaDir}service/UserServiceIT.java`,
      `${SERVER_TEST_SRC_DIR}${this.javaDir}service/mapper/UserMapperTest.java`,
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/UserResourceIT.java`,
      `${SERVER_TEST_SRC_DIR}${this.javaDir}web/rest/PublicUserResourceIT.java`,
    ]);
  }
  if (this.authenticationTypeJwt) {
    replaceNtsSaasCore.apply(this, [
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}security/DomainUserDetailsService.java`,
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}service/dto/AdminUser.java`,
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}service/dto/User.java`,
    ]);
  }
  replaceNtsSaasCore.apply(this, [`${SERVER_MAIN_SRC_DIR}${this.javaDir}config/CacheConfiguration.java`]);
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
  this.replaceContent(
    `${SERVER_TEST_SRC_DIR}${this.javaDir}TechnicalStructureTest.java`,
    `.layer("Client")`,
    `.optionalLayer("Client")`,
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
    this.replaceContent(
      `${SERVER_MAIN_RES_DIR}config/liquibase/changelog/00000000000000_initial_schema.xml`,
      `"${this.jhiPrefix}_user_authority"`,
      `"${this.jhiPrefix}_user_authorities"`,
      true
    );
  }
}

export function configureNtsSaasFrameworkToEntityServer() {
  replaceNtsSaasCore.apply(this, [
    `${SERVER_MAIN_SRC_DIR}${this.javaDir}config/SecurityConfiguration.java`,
    `${SERVER_MAIN_SRC_DIR}${this.javaDir}${this.mainClass}.java`,
  ]);
  if (this.authenticationTypeOauth2 && !this.applicationTypeMicroservice) {
    replaceNtsSaasCore.apply(this, [`${SERVER_TEST_SRC_DIR}${this.javaDir}test/util/OAuth2TestUtil.java`]);
  }
  if (
    this.cacheProviderEhCache ||
    this.cacheProviderCaffeine ||
    this.cacheProviderHazelcast ||
    this.cacheProviderInfinispan ||
    this.cacheProviderMemcached ||
    this.cacheProviderRedis ||
    this.applicationTypeGateway
  ) {
    replaceNtsSaasCore.apply(this, [`${SERVER_MAIN_SRC_DIR}${this.javaDir}config/CacheConfiguration.java`]);
  }
  if (!this.skipUserManagement && (this.applicationTypeGateway || this.applicationTypeMonolith)) {
    replaceNtsSaasCore.apply(this, [`${SERVER_MAIN_SRC_DIR}${this.javaDir}web/rest/AccountResource.java`]);
  }

  if (!shouldSkipUserManagement(this) && !this.authenticationTypeOauth2) {
    replaceNtsSaasCore.apply(this, [
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}security/DomainUserDetailsService.java`,
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}security/UserNotActivatedException.java`,
    ]);
  }
  if (!this.skipUserManagement || (this.authenticationTypeOauth2 && !this.databaseTypeNo)) {
    replaceNtsSaasCore.apply(this, [
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}service/dto/AdminUser.java`,
      `${SERVER_MAIN_SRC_DIR}${this.javaDir}service/dto/User.java`,
      `${SERVER_MAIN_SRC_DIR}${this.entityAbsoluteFolder}/web/rest/${this.entityClass}Resource.java`,
      `${SERVER_MAIN_SRC_DIR}${this.entityAbsoluteFolder}/repository/${this.entityClass}Repository.java`,
      `${SERVER_MAIN_SRC_DIR}${this.entityAbsoluteFolder}/service/${this.entityClass}Service.java`,
    ]);
    this.replaceContent(
      `${SERVER_MAIN_SRC_DIR}${this.entityAbsoluteFolder}/domain/${this.entityClass}${this.entitySuffix}.java`,
      `package ${this.packageName}.domain;`,
      `package ${this.packageName}.domain;\nimport org.nentangso.core.domain.*;`,
      true
    );
  }
}
