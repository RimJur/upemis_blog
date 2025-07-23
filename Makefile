build-tailwind:
	./tailwindcss -i ./static/css/tail-input.css -o ./static/css/tail-output.css
	./tailwindcss -i ./static/css/tail-input.css -o ./static/css/tail-output.min.css --minify
