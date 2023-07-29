import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import mongoose from 'mongoose';

import User from '../Models/user';

import Movie from '../Models/movie';
import { GenerateToken } from '../Util/index';

// Utility Function
function SanitizeArray(unsanitizedString: string): string[]
{
    if(unsanitizedString == null || unsanitizedString == undefined)
    {
        return Array<string>();
    }

    let unsanitizedArray: string[] = unsanitizedString.split(',');

    let sanitizedArray: string[] = Array<string>();
    for (const unsanitizedString of unsanitizedArray) 
    {
        sanitizedArray.push(unsanitizedString.trim());
    }
    return sanitizedArray;
}

/* Authentication Functions */

export function ProcessRegistration(req:Request, res:Response, next:NextFunction): void
{
    // instantiate a new user object
    let newUser = new User
    ({
        username: req.body.username,
        emailAddress: req.body.EmailAddress,
        displayName: req.body.FirstName + " " + req.body.LastName 
    });

    User.register(newUser, req.body.password, (err) => 
    {
        if(err instanceof mongoose.Error.ValidationError)
        {
            console.error('All Fields Are Required');
            return res.json({success: false, msg: 'ERROR: User Not Registered. All Fields Are Required'});
        }


        if(err){
            console.error('Error: Inserting New User');
            if(err.name == "UserExistsError")
            {
               console.error('Error: User Already Exists');
            }
            return res.json({success: false, msg: 'User not Registered Successfully!'});
        }
        // if we had a front-end (Angular, React or a Mobile UI)...
        return res.json({success: true, msg: 'User Registered Successfully!'});

        
    });
}

export function ProcessLogin(req:Request, res:Response, next:NextFunction): void
{
    passport.authenticate('local', (err:any, user:any, info:any) => {
        // are there server errors?
        if(err)
        {
            console.error(err);
            return next(err);
        }

        // are the login errors?
        if(!user)
        {
			return res.json({success: false, msg: 'ERROR: User Not Logged in.'});
        }

        req.logIn(user, (err) =>
        {
            // are there db errors?
            if(err)
            {
                console.error(err);
                res.end(err);
            }

            const authToken = GenerateToken(user);

            return res.json({success: true, msg: 'User Logged In Successfully!', user: {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                emailAddress: user.emailAddress
            }, token: authToken});
        });
        return;
    })(req, res, next);
}

export function ProcessLogout(req:Request, res:Response, next:NextFunction): void
{
    req.logout(() =>{
        console.log("User Logged Out");
    });
    
    // if we had a front-end (Angular, React or Mobile UI)...
    res.json({success: true, msg: 'User Logged out Successfully!'});

}


/* API Functions */
export function DisplayMovieList(req: Request, res: Response, next: NextFunction): void
{
    Movie.find({})
    .then(function(data)
    {
        res.status(200).json({success: true, msg: "Movie List Displayed Successfully", data: data});
    })
    .catch(function(err)
    {
        console.error(err);
        res.status(500).json({success: false, msg: "ERROR: Something Went Wrong", data: null});
    });
}

export function DisplayMovieByID(req: Request, res: Response, next: NextFunction): void
{
    try
    {
        let id = req.params.id;
        Movie.findById({_id: id})
        .then(function(data)
        {
            if(data)
            {
                res.status(200).json({success: true, msg: "Movie Retrieved by ID Successfully", data: data});
            }
            else
            {
                res.status(404).json({success: false, msg: "Movie ID Not Found", data: data});
            }
            
        })
        .catch(function(err)
        {
            console.error(err);
            res.status(400).json({success: false, msg: "ERROR: Movie ID not formatted correctly", data: null});
        });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({success: false, msg: "ERROR: Something Went Wrong", data: null});
    }
}

export function AddMovie(req: Request, res: Response, next: NextFunction): void
{
    try
    {
        let genre =  SanitizeArray((req.body.genre as string));
        let director =  SanitizeArray((req.body.director as string));
        let writers =  SanitizeArray((req.body.writers as string));
        let actors =  SanitizeArray((req.body.actors as string));
        let movie = new Movie({
            id: req.body.id,
            title: req.body.title,
            studio: req.body.studio,
            genre: genre,
            director: director,
            writers: writers,
            actors: actors,
            runningTime: req.body.runningTime,
            year: req.body.year,
            briefDescription: req.body.shortDescription,
            mpaRating: req.body.mpaRating,
            posterLink: req.body.posterLink,
            criticsRating: req.body.criticsRating
        });
    
        Movie.create(movie)
        .then(function()
        {
            res.status(200).json({success: true, msg: "Movie Added Successfully", data:movie});
        })
        .catch(function(err)
        {
            console.error(err);
            if(err instanceof mongoose.Error.ValidationError)
            {
                res.status(400).json({success: false, msg: "ERROR: Movie Not Added. All Fields are required", data:null});
            }
            else
            {
                res.status(400).json({success: false, msg: "ERROR: Movie Not Added.", data:null});
            }
        });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({success: false, msg: "Something Went Wrong", data: null});
    }
}

export function UpdateMovie(req: Request, res: Response, next: NextFunction): void
{
    try
    {
        let id = req.params.id;
        let genre =  SanitizeArray((req.body.genre as string));
        let director =  SanitizeArray((req.body.director as string));
        let writers =  SanitizeArray((req.body.writers as string));
        let actors =  SanitizeArray((req.body.actors as string));
        let movieToUpdate = new Movie({
            _id: id,
            id: req.body.id,
            title: req.body.title,
            studio: req.body.studio,
            genre: genre,
            director: director,
            writers: writers,
            actors: actors,
            runningTime: req.body.runningTime,
            year: req.body.year,
            briefDescription: req.body.shortDescription,
            mpaRating: req.body.mpaRating,
            posterLink: req.body.posterLink,
            criticsRating: req.body.criticsRating
        });
    
        Movie.updateOne({_id: id}, movieToUpdate)
        .then(function()
        {
            res.status(200).json({success: true, msg: "Movie Updated Successfully", data:movieToUpdate});
        })
        .catch(function(err)
        {
            console.error(err);
            if(err instanceof mongoose.Error.ValidationError)
            {
                res.status(400).json({success: false, msg: "ERROR: Movie Not Updated. All Fields are required", data:null});
            }
            else
            {
                res.status(400).json({success: false, msg: "ERROR: Movie Not Updated.", data:null});
            }
        });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({success: false, msg: "Something Went Wrong", data: null});
    }
}

export function DeleteMovie(req: Request, res: Response, next: NextFunction): void
{
    try
    {
        let id = req.params.id;

        Movie.deleteOne({_id: id})
        .then(function()
        {
            res.status(200).json({success: true, msg: "Movie Deleted Successfully", data:id});
        })
        .catch(function(err)
        {
            console.error(err);
            res.status(400).json({success: false, msg: "ERROR: Movie ID not formatted correctly", data: null});
        });
    }
    catch(err)
    {
        console.error(err);
        res.status(500).json({success: false, msg: "ERROR: Something Went Wrong", data: null});
    }
}