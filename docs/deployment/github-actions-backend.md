# GitHub Actions Backend Deploy Draft

## Goal

Provide a starting point for deploying the OCI backend from GitHub Actions.

## Draft Workflow

The draft workflow is stored at:

```text
.github/workflows/backend-deploy.example.yml
```

It is intentionally named `.example.yml` so it does not run automatically before the server and secrets are ready.

## Required Secrets

| Secret | Description |
| --- | --- |
| `OCI_HOST` | OCI server public IP or domain |
| `OCI_USER` | SSH user |
| `OCI_SSH_KEY` | Private SSH key with access to the server |

## Activation

After the OCI host is ready:

1. Add the GitHub repository secrets.
2. Copy `backend-deploy.example.yml` to `backend-deploy.yml`.
3. Confirm the server path `/opt/proj01-quiz-widget`.
4. Run the workflow manually with `workflow_dispatch`.
5. Check `/health`.

## Caution

The workflow creates `infra/env/api.env` from the example only if it does not already exist. For real production, create the production env file on the server manually or modify the workflow to write secrets safely.
