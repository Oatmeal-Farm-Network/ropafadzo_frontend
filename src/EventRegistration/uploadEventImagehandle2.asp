<%@ Language=VBScript %>

<% 

Response.Expires = -1
Server.ScriptTimeout = 600
Dim filelength

%>
<!-- #include file="GlobalVariables.asp" -->
<!-- #include file="Freeaspupload.asp" -->
<%

' ****************************************************
' Change the value of the variable below to the pathname
' of a directory with write permissions, for example "C:\Inetpub\wwwroot"
  Dim uploadsDirVar
  UploadPath = request.servervariables("APPL_PHYSICAL_PATH") & "Uploads\"
LongWeblink = "http://" & request.servervariables("HTTP_HOST") 
  uploadsDirVar = uploadPath
' ****************************************************




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
        'SaveFiles = "<B>Files uploaded:</B> "
        for each fileKey in Upload.UploadedFiles.keys
            SaveFiles = Upload.UploadedFiles(fileKey).FileName 
 
		'SaveFiles = SaveFiles & Upload.UploadedFiles(fileKey).FileName & " (" & Upload.UploadedFiles(fileKey).Length & "B) "
		
			 filelength = Upload.UploadedFiles(fileKey).Length
			'response.write(filelength)
        next
    else
        SaveFiles = "The file name specified in the upload form does not correspond to a valid file in the system."
    end if
	
end Function




%>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<HEAD>
<title>Photo Upload</title>
       <link rel="stylesheet" type="text/css" href="/administration/style.css">



</HEAD>

<BODY>


<%

response.write("Session(EventID) = " & Session("EventID") & "4<br>")
Dim diagnostics
if Request.ServerVariables("REQUEST_METHOD") <> "POST" then
    diagnostics = TestEnvironment()
    if diagnostics<>"" then
        response.write "<div style=""margin-left:20; margin-top:30; margin-right:30; margin-bottom:30;"">"
        response.write diagnostics
        response.write "<p>After you correct this problem, reload the page."
        response.write "</div>"
    else
        response.write "<div style=""margin-left:150"">"
        OutputForm()
        response.write "</div>"
    end if
else
  
	Filename =  LongWeblink & "/uploads/" & SaveFiles()
    

    str1 = Filename
	str2 = "'"
	If InStr(str1,str2) > 0 Then
		Filename= Replace(str1,  str2, "''")
	End If  


	Query =  " UPDATE EventSiteDesignTemp Set EventImage = '" &  Filename & "' "
	Query =  Query & " where EventID = " & Session("EventID") & ";" 

response.write(Query)

Conn.Execute(Query)

Conn.Close
Set Conn = nothing


Logo =  Filename
%>


 <%

end if
	Response.Redirect("EditEventHome.asp?EventID=" & Session("EventID"))
%>





</BODY>
</HTML>
