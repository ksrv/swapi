import express from './express';
import db from './db';


export default app => {
  express(app);
  db(app);
};