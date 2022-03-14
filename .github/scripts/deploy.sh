#!/bin/sh

set -ex

[[ -z "$DEPLOY_TARGET"    ]] && { echo "error: DEPLOY_TARGET environment variable not set"      >&2 ; exit 1 ; }
[[ -z "$DEPLOY_ENV"       ]] && { echo "error: DEPLOY_ENV environment variable not set"      >&2 ; exit 1 ; }
[[ -z "$COMMIT_TAG"       ]] && { echo "error: COMMIT_TAG environment variable not set"       >&2 ; exit 1 ; }
[[ -z "$COMMIT_SHORT_SHA" ]] && { echo "error: COMMIT_SHORT_SHA environment variable not set" >&2 ; exit 1 ; }
[[ -z "$GITHUB_USER"      ]] && { echo "error: GITHUB_USER environment variable not set"      >&2 ; exit 1 ; }
[[ -z "$GITHUB_TOKEN"     ]] && { echo "error: GITHUB_TOKEN environment variable not set"     >&2 ; exit 1 ; }

(
    set +x # make sure we don't leak secrets here
    git clone https://$GITHUB_USER:$GITHUB_TOKEN@github.com/capsulesocial/capsule-deployer.git
    echo "$ANSIBLE_PRIVATE_KEY" >capsule-deployer/ansible/ssh-key
    chmod 400 capsule-deployer/ansible/ssh-key
)

cd capsule-deployer/ansible
ansible-playbook -u ansible --private-key ssh-key -i hosts.ini playbooks/capsule-vue.deploy.capsule-central.yml --diff
