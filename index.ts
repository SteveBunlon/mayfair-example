import {TConditionTree} from "@forestadmin/datasource-customizer/dist/templates";

require('dotenv').config();

// Import the requirements
const {createAgent} = require('@forestadmin/agent');
const {createSqlDataSource} = require("@forestadmin/datasource-sql");

async function getEventData(context) {
    const result = await context.dataSource.getCollection('events').list({
        conditionTree: {
            field: 'id',
            value: context.formValues.event[0],
            operator: 'Equal',
        },
    }, ['id', 'maxNumberOfParticipant', 'owner']);

    return result[0];
}

// Create your Forest Admin agent
createAgent({
    // These process.env variables should be provided in the onboarding
    authSecret: process.env.FOREST_AUTH_SECRET,
    agentUrl: process.env.FOREST_AGENT_URL,
    envSecret: process.env.FOREST_ENV_SECRET,
    isProduction: process.env.NODE_ENV === 'production',
    forestServerUrl: process.env.FOREST_SERVER_URL,
    typingsPath: './typings.d.ts',
    loggerLevel: 'Debug',
})
    .addDataSource(createSqlDataSource({
        username: 'forest',
        password: 'secret',
        schema: 'public',
        host: 'localhost',
        port: 5435,
        dialect: 'postgres',
        database: 'circles',
    }))
    .customizeCollection('circles', circleCollection => {
        circleCollection.addAction('add event', {
            scope: 'Single',
            form: [{
                label: 'event',
                type: 'Collection',
                collectionName: 'events',
            }, {
                label: 'max participant',
                type: 'Number',
                isReadOnly: true,
                if: (context) => {
                    return !!context.formValues.event
                },
                value: async context => {
                    const event = await getEventData(context);
                    return event.maxNumberOfParticipant;
                }
            }, {
                label: 'owner',
                type: 'Number',
                isReadOnly: true,
                if: (context) => {
                    return !!context.formValues.event
                },
                value: async context => {
                    const event = await getEventData(context);
                    return event.owner;
                }
            }, {
                label: 'additionalField',
                type: 'String',
                isRequired: true,
                if: (context) => {
                    return !!context.formValues.event
                },
            }, {
                label: 'additionalField2',
                type: 'String',
                isRequired: true,
                if: (context) => {
                    return !!context.formValues.event
                },
            }],
            async execute(context, resultBuilder) {
                //TODO put the event creation logic here, here is a template
                const circle_id = (await context.getRecordIds())[0];
                const eventToCreate = {
                    circle_id,
                    maxNumberOfParticipant: context.formValues['max participant'],
                    owner: context.formValues['owner'],
                }
                const result = await context.dataSource.getCollection('circle_events').create([eventToCreate]);
                console.log(result);

                return resultBuilder.success('Your event has been successfully created');
            }
        })
    })
    .mountOnStandaloneServer(3000)
    .start();
