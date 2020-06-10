#!/usr/bin/env bash

npm run build;

firebase use tokenlandia-admin-staging;

firebase deploy;
