/// <reference path="../pb_data/types.d.ts" />

// Trigger a site rebuild whenever a post is created or updated, so the static
// site picks up published changes. Set DEPLOY_HOOK_URL in the Railway service
// env — either a Cloudflare Pages deploy hook or a GitHub repository_dispatch
// endpoint. No-op (logged) if the var is unset.
function triggerDeploy(context) {
  const url = $os.getenv('DEPLOY_HOOK_URL');
  if (!url) {
    console.log('[deploy-hook] DEPLOY_HOOK_URL not set; skipping (' + context + ')');
    return;
  }
  try {
    $http.send({ url: url, method: 'POST', timeout: 20 });
    console.log('[deploy-hook] triggered site rebuild (' + context + ')');
  } catch (err) {
    console.log('[deploy-hook] failed: ' + err);
  }
}

onRecordAfterCreateRequest((e) => {
  triggerDeploy('create ' + e.record.getString('slug'));
}, 'posts');

onRecordAfterUpdateRequest((e) => {
  triggerDeploy('update ' + e.record.getString('slug'));
}, 'posts');
