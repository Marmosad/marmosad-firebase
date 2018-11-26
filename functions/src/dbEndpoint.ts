import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const settings = {
    timestampsInSnapshots: true
};
db.settings(settings);
const marmosadCards = db.collection("marmosad-cards");

export const getPack = functions.https.onRequest((request, response) => {
    let whiteCardCount = -1;
    let blackCardCount = -1;

    let requestedCardPack = request.get('card-pack-name');
    console.log(requestedCardPack);
    if (requestedCardPack === null || requestedCardPack === undefined) {
        response.status(400).send('card-pack-name not found in request headers');
        console.log(requestedCardPack);
        console.log('123');
        return
    }

    marmosadCards.doc('valid-card-packs').get().then((doc) => {
        if (doc.exists) {
            console.log(doc.data());
            if (doc.data()[requestedCardPack]) {
                return true
            }
            else {
                response.status(400).send('requested card pack: ' + requestedCardPack + ' was not found');
                return false
            }
        } else {
            response.status(500).send('card pack validation failed, no card pack metadata found');
            return false
        }
    }).then((success) => {
        if (success) {
            marmosadCards.doc(requestedCardPack).collection('black-cards').get().then(collection => {
                blackCardCount = collection.size;
                return
            }).then(() => {
                marmosadCards.doc(requestedCardPack).collection('white-cards').get().then((collection) => {
                    whiteCardCount = collection.size;
                    return
                }).then(() => {
                    response.send({
                        message: 'Successfully returned ' + requestedCardPack,
                        responseObj: {whiteCardCount: whiteCardCount, blackCardCount: blackCardCount}
                    })
                })
            });
        }
        return
    });
});