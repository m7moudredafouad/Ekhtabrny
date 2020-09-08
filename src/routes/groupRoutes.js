const express = require('express')
const router = express.Router();

const {protect} = require('../controllers/authController');
const {restrictToInGroup, restrictToMeAndAdmins, getMyGroups, createGroup, addMember, requestToJoinGroup, getAllPending, getAllMembers, removeRequestToJoinGroup} = require('../controllers/groupController');

router.use(protect)

router.route('/')
    .get(getMyGroups)
    .post(createGroup);


router.get('/:groupid/pending', restrictToInGroup('admin'), getAllPending)
router.get('/:groupid/members', restrictToInGroup('admin', 'member'), getAllMembers);


router.post('/:groupid/members/request', requestToJoinGroup)
router.post('/:groupid/members/accept/:memberid', restrictToInGroup('admin'), addMember);
router.delete('/:groupid/members/delete/:memberid', restrictToMeAndAdmins, removeRequestToJoinGroup)

module.exports = router;