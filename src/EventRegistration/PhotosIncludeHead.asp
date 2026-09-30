
<!-- #include file="freeaspupload.asp" -->
<%


' ****************************************************
' Change the value of the variable below to the pathname
' of a directory with write permissions, for example "C:\Inetpub\wwwroot"
  Dim uploadsDirVar
  uploadsDirVar = "E:\\Inetpub\\wwwroot\\ecommerce-1\\milkyway\\alpacagalaxy.com\\www\\Uploads" 
' ****************************************************

' Note: this file uploadTester.asp is just an example to demonstrate
' the capabilities of the freeASPUpload.asp class. There are no plans
' to add any new features to uploadTester.asp itself. Feel free to add
' your own code. If you are building a content management system, you
' may also want to consider this script: http://www.webfilebrowser.com/

function OutputForm()
%><table border = "1" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bordercolor = "" align = "center" width = "800">
	<tr>
		<td class = "body" bgcolor ="cccccc">
			<br><h2><center><b>Photos</b></center> </h2><br>

      </td>
	 </tr>
	<tr>
			<td>

<!-- #include file="PhotoFormInclude.asp" -->












    <form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadTester.asp" onSubmit="return onSubmitForm();">
	<B>File names:</B><br>
    File 1: <input name="attach1" type="file" size=35><br>
    File 2: <input name="attach2" type="file" size=35><br>
    File 3: <input name="attach3" type="file" size=35><br>
    File 4: <input name="attach4" type="file" size=35><br>
	File 5: <input name="attach5" type="file" size=35><br>
    File 6: <input name="attach6" type="file" size=35><br>
	 File 7: <input name="attach7" type="file" size=35><br>
	 File 8: <input name="attach8" type="file" size=35><br>
    <br> 
	
    
	</td>
	</tr>
	</table>
	<table width = "800" border = "0" bgcolor ="cccccc" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
	<tr>
	<td  align = "center">
		<input type = "hidden" name="ID" value= "<%= ID %>" >
		<input style="margin-top:4" type=submit value="Upload">
		</td>
</tr>
</table>

    </form>
<%
end function

function TestEnvironment()
    Dim fso, fileName, testFile, streamTest
    TestEnvironment = ""
    Set fso = Server.CreateObject("Scripting.FileSystemObject")
    if not fso.FolderExists(uploadsDirVar) then
        TestEnvironment = "<B>Folder " & uploadsDirVar & " does not exist.</B><br>The value of your uploadsDirVar is incorrect. Open uploadTester.asp in an editor and change the value of uploadsDirVar to the pathname of a directory with write permissions."
        exit function
    end if
    fileName = uploadsDirVar & "\test.txt"
    on error resume next
    Set testFile = fso.CreateTextFile(fileName, true)
    If Err.Number<>0 then
        TestEnvironment = "<B>Folder " & uploadsDirVar & " does not have write permissions.</B><br>The value of your uploadsDirVar is incorrect. Open uploadTester.asp in an editor and change the value of uploadsDirVar to the pathname of a directory with write permissions."
        exit function
    end if
    Err.Clear
    testFile.Close
    fso.DeleteFile(fileName)
    If Err.Number<>0 then
        TestEnvironment = "<B>Folder " & uploadsDirVar & " does not have delete permissions</B>, although it does have write permissions.<br>Change the permissions for IUSR_<I>computername</I> on this folder."
        exit function
    end if
    Err.Clear
    Set streamTest = Server.CreateObject("ADODB.Stream")
    If Err.Number<>0 then
        TestEnvironment = "<B>The ADODB object <I>Stream</I> is not available in your server.</B><br>Check the Requirements page for information about upgrading your ADODB libraries."
        exit function
    end if
    Set streamTest = Nothing
end function

function SaveFiles
    Dim Upload, fileName, fileSize, ks, i, fileKey

    Set Upload = New FreeASPUpload
    Upload.Save(uploadsDirVar)

	' If something fails inside the script, but the exception is handled
	If Err.Number<>0 then Exit function

    SaveFiles = ""
    ks = Upload.UploadedFiles.keys
    if (UBound(ks) <> -1) then
        SaveFiles = "<B>Files uploaded:</B> "
        for each fileKey in Upload.UploadedFiles.keys
            SaveFiles = SaveFiles & Upload.UploadedFiles(fileKey).FileName & " (" & Upload.UploadedFiles(fileKey).Length & "B) "
        next
    else
        SaveFiles = "The file name specified in the upload form does not correspond to a valid file in the system."
    end if
	SaveFiles = SaveFiles & "<br>Enter a number = " & Upload.Form("enter_a_number") & "<br>"
	SaveFiles = SaveFiles & "Checkbox values = " & Upload.Form("checkbox_values") & "<br>"
end function
%>

<HTML>
<HEAD>

<style>
BODY {background-color: white;font-family:arial; font-size:12}
</style>
<script>
function onSubmitForm() {
    var formDOMObj = document.frmSend;
    if (formDOMObj.attach1.value == "" && formDOMObj.attach2.value == "" && formDOMObj.attach3.value == "" && formDOMObj.attach4.value == "" )
        alert("Please press the browse button and pick a file.")
    else
        return true;
    return false;
}
</script>