import Env from "./env";

export const BACKEND_URL = Env.BACKEND_URL ;
export const LOGIN_URL = BACKEND_URL + "/auth/login" ;
export const CHECK_CREDENTIALS_URL = BACKEND_URL + "/auth/check/login" ;
export const REGISTER_URL = BACKEND_URL + "/auth/register" ;
export const FORGOT_PASSWORD_URL = BACKEND_URL + "/auth/forget-password" ;
export const RESET_PASSWORD_URL = BACKEND_URL + "/auth/reset-password" ;

//  Clash URL
export const CLASH_URL = BACKEND_URL + "/api/clash" ;
export const CLASH_ITEMS_URL = BACKEND_URL + "/api/clash/items" ;

