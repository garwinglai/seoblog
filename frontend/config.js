import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const API = publicRuntimeConfig.PRODUCTION
	? publicRuntimeConfig.API_PRODUCTION //seoblog.com/api
	: publicRuntimeConfig.API_DEVELOPMENT; //8000 is server side (api)

export const APP_NAME = publicRuntimeConfig.APP_NAME;

export const DOMAIN = publicRuntimeConfig.PRODUCTION
	? publicRuntimeConfig.DOMAIN_PRODUCTION //seoblog.com
	: publicRuntimeConfig.DOMAIN_DEVELOPMENT; //port 3000

export const GOOGLE_CLIENT_ID = publicRuntimeConfig.GOOGLE_CLIENT_ID;
