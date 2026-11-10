# Covariance ellipsoid

<!-- Edit the text below each ## heading; retain field names. -->

## titolo
Covariance ellipsoid

## tema
Quantitative finance

## formula
(x−μ)ᵀΣ⁻¹(x−μ) = 1
Σ = TTᵀ,  T = [[1.6,0.5,0.1],[0,0.85,0.24],[0,0,0.65]]

## spiegazione
The ellipsoid translates a covariance matrix into spatial directions and magnitudes. The highlighted section and principal axes reveal anisotropy by showing how dispersion varies with direction.

## limiti
The displayed level corresponds to a Mahalanobis distance of one. It does not automatically represent a 95% confidence region or a portfolio efficient frontier. The matrix is synthetic and positive definite.

## fonti
[SciPy — covariance and multivariate density](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.multivariate_normal.html)

## osservazione
Compare the ellipsoid grid with its three principal directions, determined by the covariance matrix, and follow the amber section while rotating the figure to distinguish semiaxis lengths from their screen projection.

## lettura
The surface contains points whose quadratic form of deviation from the mean, using inverse covariance, equals one; covariance is matrix T times its transpose.

## legenda
mint | ellipsoid grid
pale | two principal directions
amber | direction of greatest dispersion and reference section
