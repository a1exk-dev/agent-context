# Memory

## Prices are in cents

Applies when: code reads or writes a price.

Guidance: Store each price as an integer number of cents. Ensure that each total is also in cents.

Reason: Floating-point prices gave rounding errors in totals in 2025.

## The payment sandbox resets at midnight UTC

Guidance: Create the test data inside the test. Do not depend on data from an earlier day.

Reason: The payment provider deletes all sandbox data each day at 00:00 UTC.
