.PHONY: run test serve

run:
	python3 examples/toy_backprop.py

test:
	python3 -m unittest discover -s tests -v

serve:
	python3 -m http.server 8000
