'''
This script checks all files in source and compares them to those in compiled.
If a compiled file is found without it's source file, it gets removed.
'''

# TODO TODO TODO
# ALSO START USING GIT YOU ASSHOLE
# TODO TODO TODO

import glob
import os.path
import os
import copy

from typing import List

# We'll have to work though the files recursively

class FilesInFolder:
    
    def __init__(self, folder: str) -> None:
        self.__files: List[str] = []
        self.__parse_files_recursively(folder)
        self.__remove_folder_prefix(folder)
    
    
    def __parse_files_recursively(self, folder: str) -> None:
        for entry in glob.glob(f'{folder}/*'):
            if os.path.isdir(entry):
                self.__parse_files_recursively(entry)
            else:
                self.__files.append(entry)
    
    
    def __remove_folder_prefix(self, folder: str):
        self.__files = [file[len(folder)+1:] for file in self.__files]
    
    
    def filenames(self) -> List[str]:
        return copy.deepcopy(self.__files)
    
    
    def filenames_without_extensions(self):
        return [filename_without_extension(file) for file in self.filenames()]
        
        
def filename_without_extension(full_filename: str) -> str:
    return os.path.splitext(full_filename)[0]


def remove_reduntant_compiled_files():
    src_filenames = FilesInFolder('./src').filenames_without_extensions()
    compiled_filenames = FilesInFolder('./compiled').filenames_without_extensions()
    
    for compiled_file in compiled_filenames:
        if not src_filenames.count(compiled_file):
            os.remove(f'./compiled/{compiled_file}.js')
            print(f'Removed {compiled_file}.js')


remove_reduntant_compiled_files()
