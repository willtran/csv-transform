import compose from 'koa-compose';
import routerAuth from './router-auth';
import routerUser from './router-user';
import routerIndex from './router-index';
import routerTransformCSV from './router-transformCSV';
//We need to convert list of separated route in to the one
let routers = [
  routerAuth,
  routerUser,
  routerIndex,
  routerTransformCSV
];

//So we extract the middelware from router
let middleware = [];
routers.forEach((router) => {
  middleware.push(router.routes())
  middleware.push(router.allowedMethods())
});

//Then put them into one router. Magic here! 
export default compose(middleware);
