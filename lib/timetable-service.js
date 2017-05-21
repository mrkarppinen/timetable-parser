const GraphqlClient = require('graphql-client');
const Timetable = require('../lib/timetable.js');


class TimetableService {


  constructor (){

    this.client = new GraphqlClient({
      url: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
      headers: {
        'Content-type': 'application/json'
      }
    });

  }

  get(name, date){

    var query = `{stops(name: "${name}"){
      name
    	stoptimesForServiceDate(date: "${date}"){
        pattern {
            id
            #name
            #headsign
            route {
              #gtfsId
              shortName
              #longName
            }
            directionId
        },
        stoptimes {
          scheduledDeparture
        }
      }
    }
    }`;

    return new Promise( (resolve, reject) => {

      this.client.query(query, {})
      .then(function(body) {
        let timetable = new Timetable(body.data);
        resolve(timetable.sort().toJSON());
      })
      .catch(function(err) {
        reject(err);
      });



    });




  }


}

module.exports = TimetableService;