/*
Copyright 2020 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React, { useState } from 'react';
import Error from './Error';
import Loading from './Loading';


function TestPersistQueries({ aemHeadlessClient }) {

    const [data, setData] = useState();
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [persistedQueryPath, setPersistedQueryPath] = useState('wknd-shared/adventures-all');

    // handle execution of test query
    const handleSubmit = async (evt) => {

        try {
            setIsLoading(true);
            // AEM GraphQL queries are asynchronous, either await their return or use Promise-based .then(..) { ... } syntax
            const response = await aemHeadlessClient.runPersistedQuery(persistedQueryPath);

            setIsLoading(false);

            // The GraphQL data is stored on the response's data field
            setData(response.data);
            // Any errors are stored on the response's error field
            setErrors(response.errors ? mapErrors(response.errors) : undefined);
        } catch (e) {
            console.error(e);
            setErrors(e);
        }

    }

    return (
        <div className="testquery">
            <div className="testquery__input">
                <label for="persistentQuery">Choose a query:</label>
                <select name="persistentQuery" id="persistentQuery"
                    value={persistedQueryPath}
                    onChange={e => setPersistedQueryPath(e.target.value)} >
                    <option value="wknd-shared/adventures-all">wknd-shared/adventures-all</option>
                    <option value="wknd-shared/adventures-by-activity">wknd-shared/adventures-by-activity</option>
                    <option value="wknd-shared/adventure-by-slug">wknd-shared/adventure-by-slug</option>
                </select>
                <input type="text"></input>
                <button onClick={e => handleSubmit(e)} >Test Query</button>
            </div>
            <RenderResponse data={data} errors={errors} isLoading={isLoading} />
        </div>

    );
}

/**
 * Render the AEM response
 * @param {*} response 
 * @returns 
 */
function RenderResponse({ data, errors, isLoading }) {
    //If response is null then return a loading state...
    if (isLoading) return <Loading />;

    //If there is an error with the GraphQL query
    if (errors) return <Error errorMessage={errors} />;

    if (!data) return <p>Test a query by filling out the form above</p>;

    return (
        <div className="testquery__result">
            <div><pre>{JSON.stringify(data, null, 2)}</pre></div>
        </div>
    );

}

/**
 * concatenate error messages into a single string.
 * @param {*} errors
 */
export const mapErrors = function (errors) {
    return errors.map((error) => error.message).join(",");
}

export default TestPersistQueries;