import healthCheck from './requests/health-check.js';
import createGame from './requests/create-game.js';
import joinGameAsPlayer-2 from './requests/join-game-as-player-2.js';
import getGameStateAfterJoin from './requests/get-game-state-after-join.js';
import rejectOutOfTurnPlay from './requests/reject-out-of-turn-play.js';
import p1PlaysT from './requests/p1-plays-t.js';
import p2PlaysE from './requests/p2-plays-e.js';
import p1PlaysS from './requests/p1-plays-s.js';
import p1ClaimsWord from './requests/p1-claims-word.js';
import claimerCannotAcceptOwnClaim from './requests/claimer-cannot-accept-own-claim.js';
import p2AcceptsClaim from './requests/p2-accepts-claim.js';
import rejoinReturnsSamePlayerToken from './requests/rejoin-returns-same-player-token.js';
import thirdPlayerCannotJoinInProgressGame from './requests/third-player-cannot-join-in-progress-game.js';
import validateWordCat from './requests/validate-word-cat.js';
import validateClearlyInvalidWord from './requests/validate-clearly-invalid-word.js';

export const name = 'EverySecondLetter API';
