#!/usr/bin/env bash

npm run build;

firebase use tl-token-admin;

firebase deploy;
