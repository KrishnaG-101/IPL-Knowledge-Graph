const {Spanner} = require('@google-cloud/spanner');

const projectId = 'cricket-graph-intelligence';
const keyFilename = './gcp-creds.json';

const spanner = new Spanner({
  projectId: projectId,
  keyFilename: keyFilename,
});

async function main() {
  try {
    const [instances] = await spanner.getInstances();
    console.log('Instances found:', instances.map(i => i.id));
    
    let targetInstance = null;
    let targetDatabase = null;

    for (const instance of instances) {
      console.log(`Checking instance: ${instance.id}`);
      const [databases] = await instance.getDatabases();
      console.log(`  Databases: ${databases.map(db => db.id).join(', ')}`);
      
      const db = databases.find(d => d.id === 'match_state_graph' || d.id === 'match-state-graph');
      if (db) {
         targetInstance = instance;
         targetDatabase = db;
         console.log(`Found database ${db.id} inside instance ${instance.id}`);
      }
    }

    if (!targetInstance) {
      targetInstance = instances.find(i => i.id.includes('graph') || i.id.includes('match') || i.id.includes('cricket'));
      if (!targetInstance) targetInstance = instances[0];
      console.log(`No exact DB match, defaulting to instance ${targetInstance.id}`);
    }

    if (!targetDatabase) {
       targetDatabase = targetInstance.database('match_state_graph');
       console.log(`Checking if database match_state_graph exists in instance ${targetInstance.id}...`);
       const [exists] = await targetDatabase.exists();
       if (!exists) {
          console.log(`Database match_state_graph does not exist. Creating...`);
          const [db, operation] = await targetInstance.createDatabase('match_state_graph');
          console.log(`Waiting for DB creation to finish...`);
          await operation.promise();
          console.log(`Created database match_state_graph`);
          targetDatabase = db;
       } else {
          console.log(`Database match_state_graph exists.`);
       }
    }

    const ddl = [
      `CREATE TABLE Player (
        Id INT64 NOT NULL,
        Name STRING(MAX)
      ) PRIMARY KEY (Id)`,

      `CREATE TABLE Delivery (
        Id INT64 NOT NULL,
        OverId INT64,
        BowlerId INT64,
        BatterId INT64
      ) PRIMARY KEY (Id)`,

      `CREATE TABLE \`Over\` (
        Id INT64 NOT NULL,
        OverNumber INT64
      ) PRIMARY KEY (Id)`,

      `CREATE TABLE PitchCondition (
        Id INT64 NOT NULL,
        Condition STRING(MAX)
      ) PRIMARY KEY (Id)`,

      `CREATE TABLE BowledTo (
        DeliveryId INT64 NOT NULL,
        BowlerId INT64 NOT NULL,
        BatterId INT64 NOT NULL,
        Speed FLOAT64,
        Line STRING(MAX),
        Result STRING(MAX)
      ) PRIMARY KEY (DeliveryId, BowlerId, BatterId)`,

      `CREATE TABLE InFieldAt (
        RelationId INT64 NOT NULL,
        PlayerId INT64 NOT NULL,
        DeliveryId INT64 NOT NULL,
        CoordX FLOAT64,
        CoordY FLOAT64
      ) PRIMARY KEY (RelationId)`,

      `CREATE TABLE HistoricalThreat (
        ThreatId INT64 NOT NULL,
        BowlerId INT64 NOT NULL,
        BatterId INT64 NOT NULL,
        ThreatWeight FLOAT64
      ) PRIMARY KEY (ThreatId)`,

      `CREATE PROPERTY GRAPH match_state_graph
        NODE TABLES (
          Player,
          Delivery,
          \`Over\`,
          PitchCondition
        )
        EDGE TABLES (
          BowledTo
            SOURCE KEY(BowlerId) REFERENCES Player(Id)
            DESTINATION KEY(BatterId) REFERENCES Player(Id)
            LABEL BOWLED_TO,
          InFieldAt
            SOURCE KEY(PlayerId) REFERENCES Player(Id)
            DESTINATION KEY(DeliveryId) REFERENCES Delivery(Id)
            LABEL IN_FIELD_AT,
          HistoricalThreat
            SOURCE KEY(BowlerId) REFERENCES Player(Id)
            DESTINATION KEY(BatterId) REFERENCES Player(Id)
            LABEL HISTORICAL_THREAT
        )`
    ];

    console.log("Executing DDL...");
    const [operation] = await targetDatabase.updateSchema({ statements: ddl });
    await operation.promise();
    console.log("Graph Schema Created Successfully!");

  } catch (err) {
    console.error("Error:", err);
  }
}

main();
