"""Part 1: represent one example as features, a vector, and a target."""

from __future__ import annotations


def main() -> None:
    feature_names = ["floor_area_m2", "bedrooms", "age_years"]
    features = [120.0, 3.0, 18.0]
    target = 1.0  # 1 means "needs renovation"

    if len(feature_names) != len(features):
        raise ValueError("each feature value must have a matching name")

    print("Example: one house")
    for name, value in zip(feature_names, features, strict=True):
        print(f"  {name}: {value}")

    print(f"Feature vector x: {features}")
    print(f"Target y: {target}")


if __name__ == "__main__":
    main()
