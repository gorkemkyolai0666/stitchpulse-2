#!/bin/bash
set -e

API_URL="${API_URL:-http://localhost:4017/api}"
PASS=0
FAIL=0

assert_status() {
  local name="$1"
  local expected="$2"
  local actual="$3"
  if [ "$actual" -eq "$expected" ]; then
    echo "✅ $name (HTTP $actual)"
    PASS=$((PASS + 1))
  else
    echo "❌ $name (expected $expected, got $actual)"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== FramePulse Integration Tests ==="
echo "API: $API_URL"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/health")
assert_status "Health Check" 200 "$HTTP_CODE"

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@galleryframes.com","password":"demo123456"}')
HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')
assert_status "Login" 200 "$HTTP_CODE"

TOKEN=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null || echo "")

if [ -z "$TOKEN" ]; then
  echo "❌ Could not extract token"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats" -H "Authorization: Bearer $TOKEN")
assert_status "Dashboard Stats" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/work-benches" -H "Authorization: Bearer $TOKEN")
assert_status "List Work Benches" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/framing-orders" -H "Authorization: Bearer $TOKEN")
assert_status "List Framing Orders" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/equipment-maintenance" -H "Authorization: Bearer $TOKEN")
assert_status "List Equipment Maintenance" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/quality-checklists" -H "Authorization: Bearer $TOKEN")
assert_status "List Quality Checklists" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/moulding-orders" -H "Authorization: Bearer $TOKEN")
assert_status "List Moulding Orders" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/pricing-tiers" -H "Authorization: Bearer $TOKEN")
assert_status "List Pricing Tiers" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/framing-shop" -H "Authorization: Bearer $TOKEN")
assert_status "Framing Shop Profile" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/equipment-maintenance/urgent" -H "Authorization: Bearer $TOKEN")
assert_status "Urgent Equipment Maintenance" 200 "$HTTP_CODE"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/moulding-orders/pending" -H "Authorization: Bearer $TOKEN")
assert_status "Pending Moulding Orders" 200 "$HTTP_CODE"

CREATE_BENCH=$(curl -s -w "\n%{http_code}" "$API_URL/work-benches" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Bench #99","zone":"Test Zone","specialty":"standard","notes":"Integration test bench"}')
HTTP_CODE=$(echo "$CREATE_BENCH" | tail -1)
assert_status "Create Work Bench" 201 "$HTTP_CODE"

BENCH_ID=$(echo "$CREATE_BENCH" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$BENCH_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/work-benches/$BENCH_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"maintenance"}')
  assert_status "Update Work Bench" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/work-benches/$BENCH_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Work Bench" 200 "$HTTP_CODE"
fi

CREATE_ORDER=$(curl -s -w "\n%{http_code}" "$API_URL/moulding-orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"customerName":"Test Customer","mouldingProfile":"Walnut Classic 2.5\"","supplierName":"Larson-Juhl Chicago","price":99}')
HTTP_CODE=$(echo "$CREATE_ORDER" | tail -1)
assert_status "Create Moulding Order" 201 "$HTTP_CODE"

ORDER_ID=$(echo "$CREATE_ORDER" | sed '$d' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])" 2>/dev/null || echo "")

if [ -n "$ORDER_ID" ]; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/moulding-orders/$ORDER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -X PATCH \
    -d '{"status":"in_progress"}')
  assert_status "Update Moulding Order" 200 "$HTTP_CODE"

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/moulding-orders/$ORDER_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -X DELETE)
  assert_status "Delete Moulding Order" 200 "$HTTP_CODE"
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/dashboard/stats")
assert_status "Unauthorized Access" 401 "$HTTP_CODE"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
