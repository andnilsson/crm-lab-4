import { Person, Lead } from './model';
import getTokenAsync from 'dyn365-access-token';
import unirest = require('unirest');
const request = require("request").defaults({ encoding: null });

async function loadPersons(): Promise<Person[]> {
    return new Promise<Person[]>((resolve, reject) => {
        var req = unirest("GET", "https://randomuser.me/api/");

        req.query({
            "gender": "female",
            "exc": "login",
            "results": "1000",
            "nat": "dk"
        });

        req.send();

        req.end(function (res) {
            if (res.error) throw new Error(res.error);
            console.log(`found ${res.body.results.length} leads`);
            resolve(res.body.results);
        });
    });
}

function firstToUpperCase(str: string): string {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}


async function createLead(person: Person): Promise<Lead> {
    return new Promise<Lead>(async (resolve, reject) => {
        try {
            resolve({
                firstname: firstToUpperCase(person.name.first),
                lastname: firstToUpperCase(person.name.last),
                telephone1: person.cell,
                emailaddress1: person.email,
                budgetamount: Math.floor(Math.random() * 80000),
                entityimage: await readimage(person.picture.large),
                subject: "Kampanj: fylleragg Roskilde 2001"
            } as Lead);
        } catch (e) { reject(null); console.log(e); };
    });
}

async function readimage(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        request.get(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                setTimeout(() => {
                    resolve(new Buffer(body).toString('base64'));
                    console.log("converted image to base64");
                }, 400);

            } else {
                reject(error);
                console.log(error);
            }
        });
    });
}

async function sendtocrm(lead: Lead, token: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        var req = unirest("POST", "https://datingautomation.api.crm4.dynamics.com/api/data/v8.2/leads");

        req.headers({
            "content-type": "application/json",
            "authorization": `Bearer ${token}`,
        });

        req.type("json");
        req.send(lead);

        req.end(function (res) {
            if (res.error) throw new Error(res.error);
            console.log("created lead");
            setTimeout(() => {
                resolve();
            }, 400);
        });
    });
}


async function load() {
    var req = {
        username: "",
        password: "",
        client_id: "",
        client_secret: "",
        resource: "https://<<tenant>>.crm4.dynamics.com",
        commonAuthority: "https://login.windows.net/<<tenant>>.onmicrosoft.com/oauth2/token",
    }

    var persons = await loadPersons();
    var createLeadReqs = persons.map(p => createLead(p));

    var leads = await Promise.all(createLeadReqs);

    var token = await getTokenAsync(req);
    var createreqs = leads.map(l => sendtocrm(l, token));

    await Promise.all(createreqs);

    console.log("all done");
}

load();