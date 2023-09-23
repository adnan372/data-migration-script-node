import  { MongoClient } from 'mongodb'

const sourceUrl = process.argv[2]
// source DB URL
const targetUrl = process.argv[3]
// target DB URL 
const collectionNames = ['address']
// names of collections u want to migrate data 

async function copyCollection(source, target, collectionName) {
    try {
      const sourceCollection = source.collection(collectionName);
      const targetCollection = target.collection(collectionName);
  
      const results = await sourceCollection.find().toArray();
      const result = await targetCollection.insertMany(results);
  
      return result.insertedCount + ' docs inserted to ' + collectionName;
    } catch (error) {
      throw error;
    }
  }
  
  async function copyCollections() {
    const sourceClient = new MongoClient(sourceUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    const targetClient = new MongoClient(targetUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    try {
      await sourceClient.connect();
      console.log('Connected to source database');
  
      await targetClient.connect();
      console.log('Connected to target database');
  
      const sourceDb = sourceClient.db();
      const targetDb = targetClient.db();
  
      for (const collectionName of collectionNames) {
        const result = await copyCollection(sourceDb, targetDb, collectionName);
        console.log(result);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Close the database connections
      await sourceClient.close();
      await targetClient.close();
      console.log('Disconnected from both databases');
    }
  }
  
  copyCollections();
