#!/usr/bin/env bash

npm run build;

firebase use tokenlandia-admin;

firebase target:apply hosting tokenlandia-admin tokenlandia-admin;

firebase deploy --only hosting:tokenlandia-admin;
