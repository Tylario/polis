import * as dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import isTrue from 'boolean';
const devHostname = process.env.API_DEV_HOSTNAME || 'localhost:5000';
const devMode = isTrue(process.env.DEV_MODE);
const domainOverride = process.env.DOMAIN_OVERRIDE || null;
const prodHostname = process.env.API_PROD_HOSTNAME || 'pol.is';
const serverPort = parseInt(process.env.API_SERVER_PORT || process.env.PORT || '5000', 10);
const shouldUseTranslationAPI = isTrue(process.env.SHOULD_USE_TRANSLATION_API);
import('source-map-support').then((sourceMapSupport) => {
  sourceMapSupport.install();
});
export default {
  domainOverride: domainOverride,
  isDevMode: devMode,
  serverPort: serverPort,
  getServerNameWithProtocol: (req) => {
    if (devMode) {
      return `${req.protocol}://${req.headers.host}`;
    }
    if (domainOverride) {
      return `${req.protocol}://${domainOverride}`;
    }
    if (req.headers.host.includes('preprod.pol.is')) {
      return 'https://preprod.pol.is';
    }
    if (req.headers.host.includes('embed.pol.is')) {
      return 'https://embed.pol.is';
    }
    if (req.headers.host.includes('survey.pol.is')) {
      return 'https://survey.pol.is';
    }
    return `https://${prodHostname}`;
  },
  getServerHostname: () => {
    if (devMode) {
      return devHostname;
    }
    if (domainOverride) {
      return domainOverride;
    }
    return prodHostname;
  },
  getServerUrl: () => {
    if (devMode) {
      return `http://${devHostname}`;
    } else {
      return `https://${prodHostname}`;
    }
  },
  adminEmailDataExport: process.env.ADMIN_EMAIL_DATA_EXPORT,
  adminEmailDataExportTest: process.env.ADMIN_EMAIL_DATA_EXPORT_TEST,
  adminEmailEmailTest: process.env.ADMIN_EMAIL_EMAIL_TEST,
  adminEmails: process.env.ADMIN_EMAILS || '[]',
  adminUIDs: process.env.ADMIN_UIDS || '[]',
  akismetAntispamApiKey: process.env.AKISMET_ANTISPAM_API_KEY || null,
  awsRegion: process.env.AWS_REGION,
  backfillCommentLangDetection: isTrue(process.env.BACKFILL_COMMENT_LANG_DETECTION),
  cacheMathResults: isTrueOrBlank(process.env.CACHE_MATH_RESULTS),
  databaseURL: process.env.DATABASE_URL,
  emailTransportTypes: process.env.EMAIL_TRANSPORT_TYPES || null,
  encryptionPassword: process.env.ENCRYPTION_PASSWORD_00001,
  fbAppId: process.env.FB_APP_ID || null,
  logLevel: process.env.SERVER_LOG_LEVEL,
  logToFile: isTrue(process.env.SERVER_LOG_TO_FILE),
  mailgunApiKey: process.env.MAILGUN_API_KEY || null,
  mailgunDomain: process.env.MAILGUN_DOMAIN || null,
  mathEnv: process.env.MATH_ENV,
  maxmindLicenseKey: process.env.MAXMIND_LICENSE_KEY,
  maxmindUserID: process.env.MAXMIND_USER_ID,
  nodeEnv: process.env.NODE_ENV,
  polisFromAddress: process.env.POLIS_FROM_ADDRESS,
  readOnlyDatabaseURL: process.env.READ_ONLY_DATABASE_URL || process.env.DATABASE_URL,
  runPeriodicExportTests: isTrue(process.env.RUN_PERIODIC_EXPORT_TESTS),
  shouldUseTranslationAPI: setGoogleApplicationCredentials(),
  staticFilesAdminPort: parseInt(process.env.STATIC_FILES_ADMIN_PORT || process.env.STATIC_FILES_PORT || '8080', 10),
  staticFilesParticipationPort: parseInt(
    process.env.STATIC_FILES_PARTICIPATION_PORT || process.env.STATIC_FILES_PORT || '8080',
    10
  ),
  staticFilesHost: process.env.STATIC_FILES_HOST,
  twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY || null,
  twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET || null,
  webserverPass: process.env.WEBSERVER_PASS,
  webserverUsername: process.env.WEBSERVER_USERNAME,
  whitelistItems: [
    process.env.DOMAIN_WHITELIST_ITEM_01 || null,
    process.env.DOMAIN_WHITELIST_ITEM_02 || null,
    process.env.DOMAIN_WHITELIST_ITEM_03 || null,
    process.env.DOMAIN_WHITELIST_ITEM_04 || null,
    process.env.DOMAIN_WHITELIST_ITEM_05 || null,
    process.env.DOMAIN_WHITELIST_ITEM_06 || null,
    process.env.DOMAIN_WHITELIST_ITEM_07 || null,
    process.env.DOMAIN_WHITELIST_ITEM_08 || null
  ].filter((item) => item !== null)
};
function isTrueOrBlank(val) {
  return val === undefined || val === '' || isTrue(val);
}
function setGoogleApplicationCredentials() {
  if (!shouldUseTranslationAPI) {
    return false;
  }
  const googleCredentialsBase64 = process.env.GOOGLE_CREDENTIALS_BASE64;
  const googleCredsStringified = process.env.GOOGLE_CREDS_STRINGIFIED;
  try {
    if (!googleCredentialsBase64 && !googleCredsStringified) {
      throw new Error('Missing Google credentials. Translation API will be disabled.');
    }
    const creds_string = googleCredentialsBase64
      ? Buffer.from(googleCredentialsBase64, 'base64').toString('ascii')
      : googleCredsStringified;
    const credentialsFilePath = '.google_creds_temp';
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsFilePath;
    fs.writeFileSync(credentialsFilePath, creds_string);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
