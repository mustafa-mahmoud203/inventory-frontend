import { CognitoUserPool} from 'amazon-cognito-identity-js'

const PoolData = {
    UserPoolId: "us-west-2_b4m20SjRA",
    ClientId: "2vf0lu14rsf4r8nb47gm0otmgj"
}

export default new CognitoUserPool(PoolData);