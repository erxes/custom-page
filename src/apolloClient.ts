import { ApolloServer, PlaygroundConfig } from 'apollo-server-express';

import * as dotenv from 'dotenv';
import resolvers from './data/resolvers';
import typeDefs from './data/schema';

// load environment variables
dotenv.config();

const { NODE_ENV, USE_BRAND_RESTRICTIONS } = process.env;

let playground: PlaygroundConfig = false;

if (NODE_ENV !== 'production') {
  playground = {
    settings: {
      'general.betaUpdates': false,
      'editor.theme': 'dark',
      'editor.reuseHeaders': true,
      'tracing.hideTracingResponse': true,
      'editor.fontSize': 14,
      'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
      'request.credentials': 'include',
    },
  };
}

const generateDataSources = () => {
  return {};
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: generateDataSources,
  playground,
  uploads: false,
  context: ({ req, res }) => {
    if (!req || NODE_ENV === 'test') {
      return {
        dataSources: generateDataSources(),
      };
    }

    const requestInfo = {
      secure: req.secure,
    };

    const user = req.user;

    if (USE_BRAND_RESTRICTIONS !== 'true') {
      return {
        brandIdSelector: {},
        userBrandIdsSelector: {},
        docModifier: doc => doc,
        commonQuerySelector: {},
        user,
        res,
        requestInfo,
      };
    }

    let scopeBrandIds = JSON.parse(req.cookies.scopeBrandIds || '[]');
    let brandIds = [];
    let brandIdSelector = {};
    let commonQuerySelector = {};
    let commonQuerySelectorElk;
    let userBrandIdsSelector = {};

    if (user) {
      brandIds = user.brandIds || [];

      if (scopeBrandIds.length === 0) {
        scopeBrandIds = brandIds;
      }

      if (!user.isOwner) {
        brandIdSelector = { _id: { $in: scopeBrandIds } };
        commonQuerySelector = { scopeBrandIds: { $in: scopeBrandIds } };
        commonQuerySelectorElk = { terms: { scopeBrandIds } };
        userBrandIdsSelector = { brandIds: { $in: scopeBrandIds } };
      }
    }

    return {
      brandIdSelector,
      docModifier: doc => ({ ...doc, scopeBrandIds }),
      commonQuerySelector,
      commonQuerySelectorElk,
      userBrandIdsSelector,
      user,
      res,
      requestInfo,
    };
  },
});

export default apolloServer;
