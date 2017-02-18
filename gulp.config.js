module.exports = function _gulpConfig() {
    'use strict';
    var build = './dev/',
        src = './src/',
        dev = './dev/',
        test = './test/',
        report = test + 'report/',
        tmpPlato = './tmpPlato/',
        platoScripts = [
            tmpPlato + 'collation/collationFunctions.js',
            tmpPlato + 'collation/concat.js',
            tmpPlato + 'collation/except.js',
            tmpPlato + 'collation/groupJoin.js',
            tmpPlato + 'collation/intersect.js',
            tmpPlato + 'collation/join.js',
            tmpPlato + 'collation/union.js',
            tmpPlato + 'collation/zip.js',
            tmpPlato + 'evaluation/evaluationFunctions.js',
            tmpPlato + 'evaluation/all.js',
            tmpPlato + 'evaluation/any.js',
            tmpPlato + 'evaluation/first.js',
            tmpPlato + 'evaluation/last.js',
            tmpPlato + 'limitation/limitationFunctions.js',
            tmpPlato + 'limitation/distinct.js',
            tmpPlato + 'limitation/where.js',
            tmpPlato + 'projection/projectionFunctions.js',
            tmpPlato + 'projection/deepFlatten.js',
            tmpPlato + 'projection/flatten.js',
            tmpPlato + 'projection/groupBy.js',
            tmpPlato + 'projection/map.js',
            tmpPlato + 'projection/orderBy.js',
            tmpPlato + 'projection/sortHelpers.js',
            tmpPlato + 'queryObjects/queryable.js',
            tmpPlato + 'queryObjects/orderedQueryable.js',
            tmpPlato + 'queryObjects/queryObjectCreators.js',
            tmpPlato + 'functionalHelpers.js',
            tmpPlato + 'helpers.js'
        ];

    return {
        buildJs: build + 'scripts/grid.js',
        build: build,
        src: src,
        platoScripts: platoScripts,
        srcRootJs: src + '/',
        srcCollationJs: src +'collation/',
        srcEvaluationJs: src + 'evaluation/',
        srcExpressionParserJs: src + 'expressionParser/',
        srcLimitationJs: src + 'limitation/',
        srcMutationJs: src + 'mutation/',
        srcProjectionJs: src + 'projection/',
        srcQueryObjectJs: src + 'queryObjects/',
        srcTransformationJs: src + 'transformation/',
        buildFiles: [build + 'scripts'],
        srcFiles: [src + 'scripts'],
        gridJs: dev + 'scripts/grid.js',
        temp: './.tmp/',
        routes: './routes/',
        dev: dev + '*.js',
        devRootJs: dev + '*.js',
        devCollationJs: dev +'collation/*.js',
        devEvaluationJs: dev + 'evaluation/*.js',
        devExpressionParserJs: dev + 'expressionParser/*.js',
        devLimitationJs: dev + 'limitation/*.js',
        devMutationJs: dev + 'mutation/*.js',
        devProjectionJs: dev + 'projection/*.js',
        devQueryObjectJs: dev + 'queryObjects/*.js',
        devTransformationJs: dev + 'transformation/*.js',
        report: report,
        plato: {
            report: './plato',
            options: {
                title: 'queryable-plato'
            }
        },
        js: [
            dev + '**/*.js',
            './*.js',
            '!./closureExterns.js',
            '!./karma.conf.js'
        ],     //Javascript file to lint
        defaultPort: 3000,
        nodeServer: './app.js',
        browserReloadDelay: 1000
    };
};