import express from 'express';
let router = express.Router();
import passport from 'passport';

/* GET the movie controller */
import {DisplayMovieList, DisplayMovieByID, AddMovie, UpdateMovie, DeleteMovie, ProcessRegistration, ProcessLogin, ProcessLogout } from '../Controllers/movie';


router.get('/',function(req, res, next)
{
   res.render('index', {title: 'Express' });
});

router.get('/list', passport.authenticate('jwt', {session: false}), (req, res, next) => DisplayMovieList(req, res, next));

router.get('/find/:id', passport.authenticate('jwt', {session: false}), (req, res, next) => DisplayMovieByID(req, res, next));

router.post('/add', passport.authenticate('jwt', {session: false}), (req, res, next) => AddMovie(req, res, next));

router.put('/update/:id' , passport.authenticate('jwt', {session: false}), (req, res, next) => UpdateMovie(req, res, next));

router.delete('/delete/:id' , passport.authenticate('jwt', {session: false}), (req, res, next) => DeleteMovie(req, res, next));

router.post('/register', (req, res, next) => ProcessRegistration(req, res,next));

router.post('/login', (req, res, next) => ProcessLogin(req, res, next));

router.get('/logout', (req, res, next) => ProcessLogout(req, res, next));

export default router;
