#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <zbar.h>
#include <iostream>
#include <iomanip>

using namespace std;
using namespace cv;
using namespace zbar;

int main(int argc, char **argv) {
    int cam_idx = 0;

    if (argc == 2) {
        cam_idx = atoi(argv[1]);
    }

    
    VideoCapture cap(cam_idx);
    if (!cap.isOpened()) {
        cerr << "Could not open camera." << endl;
        exit(EXIT_FAILURE);
    }

    //cap.set(CV_CAP_PROP_FRAME_WIDTH, 640);
    //cap.set(CV_CAP_PROP_FRAME_HEIGHT, 480);

    //namedWindow("captured", CV_WINDOW_AUTOSIZE);
    
    
    // Create a zbar reader
    ImageScanner scanner;
    
    // Configure the reader
    scanner.set_config(ZBAR_NONE, ZBAR_CFG_ENABLE, 1);

    for (;;) {
        // Capture an OpenCV frame
        cv::Mat frame, frame_grayscale;
        cap >> frame;

        // Convert to grayscale
        cvtColor(frame, frame_grayscale, CV_BGR2GRAY);

        // Obtain image data
        int width = frame_grayscale.cols;
        int height = frame_grayscale.rows;
        uchar *raw = (uchar *)(frame_grayscale.data);

        // Wrap image data
        Image image(width, height, "Y800", raw, width * height);

        // Scan the image for barcodes
        //int n = scanner.scan(image);
        int n=scanner.scan(image);

        if(n>0){
            int counter = 0;
            for (Image::SymbolIterator symbol = image.symbol_begin(); symbol != image.symbol_end(); ++symbol) {

                // do something useful with results
                cout    << symbol->get_data();
               
                
                // Get points
                /*for (Symbol::PointIterator point = symbol.point_begin(); point != symbol.point_end(); ++point) {
                    cout << point << endl;
                } */
                counter++;
            }
            image.set_data(NULL, 0);
            return 0;
        }
        

        // Show captured frame, now with overlays!
        //imshow("captured", frame);
                                                                                                                                                          
        // clean up 
        image.set_data(NULL, 0);
        
        
    }

    

    return 0;
}