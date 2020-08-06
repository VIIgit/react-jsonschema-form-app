
import enumAlternatives from './enumAlternatives';
import widgets from './widgets';
import mostCommon from './mostCommon';
import empty from './empty';
import anyOf  from './anyOf';
import oneOf  from './oneOf';
import oneOfFaulty from './oneOfFaulty';
import menu from './menu';
import dependencies from './dependencies';
import ifThenElse  from './ifThenElse';

export const samples = {
  "Most Common": mostCommon,
  "Enum Alternatives": enumAlternatives,
  "OneOf": oneOf,
  "OneOf Faulty": oneOfFaulty,
  "AnyOf": anyOf,
  "AnyOf with Array": menu,
  "Dependencies": dependencies,
  "If-Then-Else+Depencies": ifThenElse,
  "All Widgets": widgets,
  "Clear Schema": empty,
};