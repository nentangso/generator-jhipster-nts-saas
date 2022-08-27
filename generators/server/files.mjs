import { constants } from 'generator-jhipster';

const {
  SERVER_MAIN_SRC_DIR,
  SERVER_MAIN_RES_DIR,
  INTERPOLATE_REGEX,
} = constants;

export function removeNtsSaasSkipFiles() {
  [
    'GeneratedByJHipster.java',
    'web/rest/UserResource.java',
    'web/rest/PublicUserResource.java',
    'web/rest/vm/ManagedUserVM.java',
    'web/rest/vm/package-info.java',
    'service/UserService.java',
    'service/mapper/UserMapper.java',
    'service/dto/AdminUserDTO.java',
    'service/dto/UserDTO.java',
    'repository/UserRepository.java',
    'repository/AuthorityRepository.java',
    'repository/search/UserSearchRepository.java',
    'domain/Authority.java',
    `domain/${this.asEntity('User')}.java`,
    'domain/AbstractAuditingEntity.java',
    'web/rest/errors/package-info.java',
    'web/rest/errors/BadRequestAlertException.java',
    'web/rest/errors/ErrorConstants.java',
    'web/rest/errors/ExceptionTranslator.java',
    'web/rest/errors/FieldErrorVM.java',
    'client/AuthorizedFeignClient.java',
    'client/OAuth2InterceptedFeignConfiguration.java',
    'client/TokenRelayRequestInterceptor.java',
    'security/oauth2/AuthorizationHeaderUtil.java',
    'security/oauth2/AudienceValidator.java',
    'security/oauth2/JwtGrantedAuthorityConverter.java',
    'security/oauth2/OAuthIdpTokenResponseDTO.java',
    'security/SecurityUtils.java',
    'security/SpringSecurityAuditorAware.java',
    'config/FeignConfiguration.java',
    'config/AsyncConfiguration.java',
    'config/DateTimeFormatConfiguration.java',
    'config/JacksonConfiguration.java',
    'config/LocaleConfiguration.java',
  ].forEach(removingFile => {
    this.removeFile(`${SERVER_MAIN_SRC_DIR}${this.javaDir}${removingFile}`);
  });
};

export const addingServerFiles = {
  serverConfigMySql: [
    {
      condition: generator => !generator.reactive && generator.databaseTypeMysql,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/config/CustomMySqlDialect.java',
          renameTo: generator => `${generator.javaDir}config/CustomMySqlDialect.java`,
        },
      ],
    },
  ],
  serverResource: [
    {
      path: SERVER_MAIN_RES_DIR,
      templates: [
        {
          file: 'banner.txt',
        },
        {
          override: generator => !generator.jhipsterConfig.incrementalChangelog || generator.configOptions.recreateInitialChangelog,
          file: 'config/liquibase/changelog/initial_nts_helper.xml',
          renameTo: () => 'config/liquibase/changelog/00000000000001_initial_nts_helper.xml',
          options: { interpolate: INTERPOLATE_REGEX },
        },
      ],
    },
  ],
};