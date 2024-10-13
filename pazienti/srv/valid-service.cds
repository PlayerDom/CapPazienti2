using my.validexample as my from '../db/cap-valid-data-model';


service ValidService @(requires : [
    'authenticated-user',
    'system-user'
    ])
{

entity Users @(restrict : [
  {
    grant : ['READ'],
    to    : 'user'
  },
  {
    grant : ['READ', 'WRITE'],
    to    : 'admin'
  }
]) as projection on my.Users;

entity Pazienti @(restrict : [
  {
    grant : ['READ'],
    to    : 'user'
  },
  {
    grant : ['READ', 'WRITE'],
    to    : 'admin'
  }
]) as projection on my.Pazienti;

entity RaccoltaAnamnestica @(restrict : [
  {
    grant : ['READ'],
    to    : 'user'
  },
  {
    grant : ['READ', 'WRITE'],
    to    : 'admin'
  }
]) as projection on my.RaccoltaAnamnestica;

entity AnamnesiRemota @(restrict : [
  {
    grant : ['READ'],
    to    : 'user'
  },
  {
    grant : ['READ', 'WRITE'],
    to    : 'admin'
  }
]) as projection on my.AnamnesiRemota;

entity PrimeFasi @(restrict : [
  {
    grant : ['READ'],
    to    : 'user'
  },
  {
    grant : ['READ', 'WRITE'],
    to    : 'admin'
  }
]) as projection on my.PrimeFasi;

entity AnamnesiFisiologica @(restrict : [
  {
    grant : ['READ'],
    to    : 'user'
  },
  {
    grant : ['READ', 'WRITE'],
    to    : 'admin'
  }
]) as projection on my.AnamnesiFisiologica;

entity Interessi @(restrict : [
  {
    grant : ['READ'],
    to    : 'user'
  },
  {
    grant : ['READ', 'WRITE'],
    to    : 'admin'
  }
]) as projection on my.Interessi;

entity StatusRapporto @(restrict : [
  {
    grant : ['READ'],
    to    : 'user'
  },
  {
    grant : ['READ', 'WRITE'],
    to    : 'admin'
  }
]) as projection on my.StatusRapporto;


  @readonly entity UserAuthorizations as projection on my.UserAuthorizations;
}