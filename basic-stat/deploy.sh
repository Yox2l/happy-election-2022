
exit_on_failure()
{
    exit_code=${1}
    message=${2}
    if [ ${exit_code} -ne 0 ]; then
        echo "${message}, exit code:${exit_code}"
        exit ${exit_code}
    fi
}
npm run build
exit_on_failure $? "Failure while building react project, did you run 'npm install'?"
s3_bucket=kneset24.route42.co.il
echo Synching Build Folder: $s3_bucket...
aws s3 sync build/ s3://$s3_bucket --delete --cache-control max-age=31536000,public --profile personal

echo Adjusting cache...
# setting index.html cache to 0 age so react js file will be update every time that we upload new version
aws s3 cp s3://$s3_bucket/index.html s3://$s3_bucket/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --profile personal
aws s3 cp s3://$s3_bucket/part2/index.html s3://$s3_bucket/part2/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --profile personal
echo DONE!
