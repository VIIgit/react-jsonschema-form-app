
import enumAlternatives from './enumAlternatives';
import widgets from './widgets';
import mostCommon from './mostCommon';
import empty from './empty';
import anyOf  from './anyOf';
import oneOf  from './oneOf';
import oneOfFaulty from './oneOfFaulty';
import menu from './menu';

export const samples = {
  "Most Common": mostCommon,
  "Enum Alternatives": enumAlternatives,
  "OneOf": oneOf,
  "OneOf Faulty": oneOfFaulty,
  "AnyOf": anyOf,
  "AnyOf with Array": menu,
  "All Widgets": widgets,
  "Clear Schema": empty,
};